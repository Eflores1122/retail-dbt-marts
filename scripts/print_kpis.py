#!/usr/bin/env python3
"""Print the one-row Mercado Alba KPI mart from the local DuckDB file."""

from __future__ import annotations

import sys
from pathlib import Path

import duckdb

WAREHOUSE = Path(__file__).resolve().parents[1] / "target" / "mercadoalba.duckdb"


def main() -> int:
    if not WAREHOUSE.exists():
        print(f"missing {WAREHOUSE}; run make test first", file=sys.stderr)
        return 1
    connection = duckdb.connect(str(WAREHOUSE), read_only=True)
    cursor = connection.execute("select * from marts.mart_business_kpis")
    row = cursor.fetchone()
    if row is None or cursor.description is None:
        print("marts.mart_business_kpis returned no row", file=sys.stderr)
        return 1
    names = [column[0] for column in cursor.description]
    for name, value in zip(names, row, strict=True):
        print(f"{name}\t{value}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
