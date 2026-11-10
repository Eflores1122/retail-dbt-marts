#!/usr/bin/env python3
"""Build the static browser site from a dbt compile or dbt build manifest.

The page runs compiled model and test SQL in DuckDB-WASM. This script copies
the seeds, writes catalog.json, and checks that same SQL in CPython DuckDB.
"""

from __future__ import annotations

import json
import re
import shutil
import sys
from pathlib import Path

import duckdb
import yaml

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
DIST = SITE / "dist"
MANIFEST = ROOT / "target" / "manifest.json"
SEED_DIR = ROOT / "seeds"

SEED_ORDER = (
    "customers",
    "products",
    "stores",
    "mx_holidays",
    "orders",
    "order_lines",
    "inventory_snapshots",
)

TYPE_MAP = {
    "integer": "INTEGER",
    "varchar": "VARCHAR",
    "date": "DATE",
    "timestamp": "TIMESTAMP",
    "boolean": "BOOLEAN",
    "bigint": "BIGINT",
}

REF_RE = re.compile(r"ref\('([^']+)'\)")


def clean(text: str | None) -> str:
    if not text:
        return ""
    return " ".join(text.split())


def ref_name(value: object) -> str:
    if not isinstance(value, str):
        return str(value)
    match = REF_RE.search(value)
    return match.group(1) if match else value


def as_text(value: object) -> str:
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return str(value)


def relation_id(schema: str, name: str) -> str:
    return f"{schema}.{name}"


def model_group(schema: str, name: str) -> str:
    if schema == "raw":
        return "raw"
    if schema == "staging":
        return "staging"
    if schema == "intermediate":
        return "intermediate"
    if name.startswith(("dim_", "fct_")):
        return "core"
    return "published"


def test_kind(node: dict) -> str:
    meta = node.get("test_metadata") or {}
    return meta.get("name") or "singular"


def test_label(node: dict, model_name: str | None) -> str:
    kind = test_kind(node)
    column = node.get("column_name")
    meta = node.get("test_metadata") or {}
    kwargs = meta.get("kwargs") or {}
    target = model_name or "model"
    if kind == "singular":
        return node["name"]
    if kind in {"unique", "not_null"}:
        return f"{kind} {target}.{column}"
    if kind == "accepted_values":
        return f"accepted_values {target}.{column} {kwargs.get('values')}"
    if kind == "accepted_range":
        low = kwargs.get("min_value")
        high = kwargs.get("max_value")
        return f"accepted_range {target}.{column} {low}..{high}"
    if kind == "relationships":
        return (
            f"relationships {target}.{column} -> {kwargs.get('field')} "
            f"in {ref_name(kwargs.get('to'))}"
        )
    if kind == "expression_is_true":
        return f"expression_is_true {target}: {kwargs.get('expression')}"
    if kind == "unique_combination_of_columns":
        columns = kwargs.get("combination_of_columns") or []
        joined = ", ".join(columns)
        return f"unique_combination {target} ({joined})"
    return node["name"]


def execution_order(models: list[dict]) -> list[dict]:
    by_id = {node["unique_id"]: node for node in models}
    dependencies = {
        node["unique_id"]: sorted(
            dep for dep in node["depends_on"]["nodes"] if dep.startswith("model.") and dep in by_id
        )
        for node in models
    }
    ordered: list[str] = []
    seen: set[str] = set()

    def visit(unique_id: str) -> None:
        if unique_id in seen:
            return
        seen.add(unique_id)
        for dependency in dependencies[unique_id]:
            visit(dependency)
        ordered.append(unique_id)

    for unique_id in sorted(dependencies):
        visit(unique_id)
    return [by_id[unique_id] for unique_id in ordered]


def load_catalog() -> dict:
    if not MANIFEST.exists():
        print("missing target/manifest.json; run dbt compile or dbt build", file=sys.stderr)
        raise SystemExit(1)
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    nodes = manifest["nodes"]
    id_by_unique: dict[str, str] = {}

    seed_nodes = [node for node in nodes.values() if node["resource_type"] == "seed"]
    seed_nodes.sort(
        key=lambda node: (
            SEED_ORDER.index(node["name"]) if node["name"] in SEED_ORDER else len(SEED_ORDER),
            node["name"],
        )
    )
    seeds = []
    for node in seed_nodes:
        column_types = node.get("config", {}).get("column_types") or {}
        columns = {}
        for name, raw_type in column_types.items():
            mapped = TYPE_MAP.get(str(raw_type).lower())
            if mapped is None:
                print(f"unknown seed type {node['name']}.{name}: {raw_type}", file=sys.stderr)
                raise SystemExit(1)
            columns[name] = mapped
        relation = relation_id(node["schema"], node["name"])
        id_by_unique[node["unique_id"]] = relation
        seeds.append(
            {
                "id": relation,
                "name": node["name"],
                "schema": node["schema"],
                "group": "raw",
                "description": clean(node.get("description")),
                "columns": columns,
                "path": f"seeds/{node['name']}.csv",
            }
        )

    model_nodes = execution_order(
        [node for node in nodes.values() if node["resource_type"] == "model"]
    )
    models = []
    for node in model_nodes:
        compiled = (node.get("compiled_code") or "").strip()
        if not compiled:
            print(f"model {node['name']} has no compiled SQL", file=sys.stderr)
            raise SystemExit(1)
        relation = relation_id(node["schema"], node["name"])
        id_by_unique[node["unique_id"]] = relation
        unresolved = [dep for dep in node["depends_on"]["nodes"] if dep not in id_by_unique]
        if unresolved:
            print(f"{relation} depends on unresolved nodes {unresolved}", file=sys.stderr)
            raise SystemExit(1)
        depends = [id_by_unique[dep] for dep in node["depends_on"]["nodes"]]
        columns = [
            {"name": name, "description": clean(column.get("description"))}
            for name, column in node.get("columns", {}).items()
        ]
        models.append(
            {
                "id": relation,
                "name": node["name"],
                "schema": node["schema"],
                "group": model_group(node["schema"], node["name"]),
                "materialized": node["config"]["materialized"],
                "description": clean(node.get("description")),
                "path": node["original_file_path"],
                "dependsOn": depends,
                "columns": columns,
                "rawSql": (node.get("raw_code") or "").strip(),
                "sql": compiled,
            }
        )

    tests = []
    seen_names: set[str] = set()
    for node in nodes.values():
        if node["resource_type"] != "test":
            continue
        compiled = (node.get("compiled_code") or "").strip()
        if not compiled:
            print(f"test {node['name']} has no compiled SQL", file=sys.stderr)
            raise SystemExit(1)
        if node["name"] in seen_names:
            print(f"duplicate test name {node['name']}", file=sys.stderr)
            raise SystemExit(1)
        seen_names.add(node["name"])
        attached = node.get("attached_node")
        model_id = id_by_unique.get(attached) if attached else None
        model_name = model_id.split(".", 1)[1] if model_id else None
        depends = [id_by_unique[dep] for dep in node["depends_on"]["nodes"] if dep in id_by_unique]
        tests.append(
            {
                "name": node["name"],
                "kind": test_kind(node),
                "label": test_label(node, model_name),
                "model": model_id,
                "column": node.get("column_name"),
                "dependsOn": depends,
                "path": node.get("original_file_path"),
                "sql": compiled,
            }
        )
    tests.sort(key=lambda item: (item["model"] or "zzz", item["kind"], item["name"]))

    edges = []
    for model in models:
        for source in model["dependsOn"]:
            edges.append({"from": source, "to": model["id"]})

    metadata = manifest.get("metadata") or {}
    project = yaml.safe_load((ROOT / "dbt_project.yml").read_text(encoding="utf-8"))
    project_vars = project.get("vars") or {}
    required = ("calendar_start", "calendar_end", "as_of_date", "mx_utc_offset_hours")
    missing_vars = [name for name in required if name not in project_vars]
    if missing_vars:
        print(f"dbt_project.yml is missing vars {missing_vars}", file=sys.stderr)
        raise SystemExit(1)

    return {
        "project": "mercadoalba",
        "dbtVersion": metadata.get("dbt_version"),
        "adapter": metadata.get("adapter_type"),
        "database": "mercadoalba",
        "vars": {
            "calendar_start": as_text(project_vars["calendar_start"]),
            "calendar_end": as_text(project_vars["calendar_end"]),
            "as_of_date": as_text(project_vars["as_of_date"]),
            "mx_utc_offset_hours": int(project_vars["mx_utc_offset_hours"]),
        },
        "varsSource": "dbt_project.yml",
        "seeds": seeds,
        "models": models,
        "tests": tests,
        "edges": edges,
    }


def verify(catalog: dict) -> None:
    connection = duckdb.connect(":memory:")
    connection.execute("attach ':memory:' as mercadoalba")
    connection.execute("use mercadoalba")
    for schema in ("raw", "staging", "intermediate", "marts"):
        connection.execute(f"create schema {schema}")

    for seed in catalog["seeds"]:
        struct = ", ".join(f"'{name}': '{kind}'" for name, kind in seed["columns"].items())
        path = SEED_DIR / f"{seed['name']}.csv"
        connection.execute(
            f"""
            create table {seed["schema"]}.{seed["name"]} as
            select * from read_csv('{path}', header = true, columns = {{{struct}}})
            """
        )

    for model in catalog["models"]:
        kind = "table" if model["materialized"] == "table" else "view"
        connection.execute(f"create {kind} {model['schema']}.{model['name']} as\n{model['sql']}")

    kpi = connection.execute("select count(*) from marts.mart_business_kpis").fetchone()
    if kpi is None or int(kpi[0]) != 1:
        print("mart_business_kpis did not return one row", file=sys.stderr)
        raise SystemExit(1)

    failed = 0
    for test in catalog["tests"]:
        try:
            rows = connection.execute(test["sql"]).fetchall()
        except duckdb.Error as exc:
            print(f"test error {test['name']}: {exc}", file=sys.stderr)
            raise SystemExit(1) from exc
        if rows:
            failed += 1
            print(f"test failed {test['name']} ({len(rows)} rows)", file=sys.stderr)
    if failed:
        print(f"{failed} data tests failed", file=sys.stderr)
        raise SystemExit(1)
    print(
        f"catalog ok: {len(catalog['seeds'])} seeds, "
        f"{len(catalog['models'])} models, {len(catalog['tests'])} tests"
    )


def write_dist(catalog: dict) -> None:
    public = catalog
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)
    for name in ("index.html", "styles.css", "app.js"):
        shutil.copy2(SITE / name, DIST / name)
    shutil.copytree(SITE / "fonts", DIST / "fonts")
    seed_dest = DIST / "seeds"
    seed_dest.mkdir()
    for seed in catalog["seeds"]:
        shutil.copy2(SEED_DIR / f"{seed['name']}.csv", seed_dest / f"{seed['name']}.csv")
    (DIST / "catalog.json").write_text(
        json.dumps(public, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(f"wrote {DIST}")


def main() -> int:
    catalog = load_catalog()
    verify(catalog)
    write_dist(catalog)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
