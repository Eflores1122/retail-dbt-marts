#!/usr/bin/env python3
"""Fail when README.md does not quote the seeded KPI mart."""

from __future__ import annotations

import json
import sys
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

import duckdb

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
WAREHOUSE = ROOT / "target" / "mercadoalba.duckdb"
RUN_RESULTS = ROOT / "target" / "run_results.json"


def mxn(centavos: int) -> str:
    amount = (Decimal(centavos) / Decimal(100)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )
    return f"{amount:,.2f}"


def percent(numerator: int, denominator: int) -> str:
    value = (Decimal(numerator) * Decimal(100) / Decimal(denominator)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )
    return f"{value}%"


def aov_mxn(gmv_centavos: int, completed_sale_orders: int) -> str:
    pesos = Decimal(gmv_centavos) / Decimal(100)
    value = (pesos / Decimal(completed_sale_orders)).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )
    return f"{value:,.2f}"


def result_counts() -> tuple[int, int, int]:
    payload = json.loads(RUN_RESULTS.read_text(encoding="utf-8"))
    seeds = models = tests = 0
    for result in payload["results"]:
        kind = result["unique_id"].split(".", 1)[0]
        if kind == "seed":
            seeds += 1
        elif kind == "model":
            models += 1
        elif kind == "test":
            tests += 1
    return seeds, models, tests


def required_phrases() -> list[str]:
    connection = duckdb.connect(str(WAREHOUSE), read_only=True)
    kpi = connection.execute("select * from marts.mart_business_kpis").fetchone()
    columns = [column[0] for column in connection.description]
    row = dict(zip(columns, kpi, strict=True))
    gmv = int(row["gmv_centavos"])
    net = int(row["net_sales_centavos"])
    margin = int(row["margin_centavos"])
    returns = abs(int(row["return_amount_centavos"]))
    online = int(row["online_gmv_centavos"])
    orders = int(row["orders"])
    completed = int(row["completed_orders"])
    sale_orders = int(row["completed_sale_orders"])
    cancelled = int(row["cancelled_orders"])
    units = int(row["units_sold"])
    lines = int(row["order_lines"])
    active = int(row["active_customers"])
    customers = int(row["customers"])
    in_stock = int(row["in_stock_positions"])
    positions = int(row["inventory_positions"])
    online_orders = int(
        connection.execute(
            """
            select coalesce(sum(orders), 0)
            from marts.mart_store_scorecard
            where channel = 'online'
            """
        ).fetchone()[0]
    )
    phrases = [
        f"{row['window_start']} through {row['window_end']}",
        f"| GMV | {mxn(gmv)} MXN |",
        f"| Net sales | {mxn(net)} MXN |",
        f"| Gross margin | {mxn(margin)} MXN |",
        f"| Gross margin / GMV | {percent(margin, gmv)} |",
        f"| Orders | {orders:,} |",
        f"| Completed orders | {completed:,} |",
        f"| Completed sale orders | {sale_orders:,} |",
        f"| Cancelled orders | {cancelled:,} |",
        f"| AOV | {aov_mxn(gmv, sale_orders)} MXN |",
        f"| Units sold | {units:,} |",
        f"| Order lines | {lines:,} |",
        f"| Return rate | {percent(returns, gmv)} |",
        f"| Cancel rate | {percent(cancelled, orders)} |",
        f"| Online share of GMV | {percent(online, gmv)} |",
        f"| Online share of orders | {percent(online_orders, orders)} |",
        f"| In-stock rate | {percent(in_stock, positions)} |",
        f"| Active customers | {active:,} |",
        f"{returns:,} / {gmv:,} centavos",
        f"{cancelled:,} / {orders:,} orders",
        f"{online:,} / {gmv:,} centavos",
        f"{in_stock:,} / {positions:,}",
        f"{active:,} of {customers:,}",
        (
            f"{int(row['customers_none']):,} with no completed order, "
            f"{int(row['customers_one_time']):,} one-time, "
            f"{int(row['customers_returning']):,} returning, and "
            f"{int(row['customers_frequent']):,} frequent"
        ),
    ]
    stores = connection.execute(
        """
        select store_name, channel, region, orders, gmv_centavos
        from marts.mart_store_scorecard
        order by gmv_centavos desc, store_id
        """
    ).fetchall()
    for store_name, channel, region, store_orders, store_gmv in stores:
        gmv_mxn = mxn(int(store_gmv))
        phrases.append(
            f"| {store_name} | {channel} | {region} | {int(store_orders):,} | {gmv_mxn} |"
        )
    for seed_name in (
        "customers",
        "products",
        "stores",
        "mx_holidays",
        "orders",
        "order_lines",
        "inventory_snapshots",
    ):
        count = int(connection.execute(f"select count(*) from raw.{seed_name}").fetchone()[0])
        phrases.append(f"| {seed_name} | {count:,} |")
    seeds, models, tests = result_counts()
    phrases.append(f"{seeds} seeds, {models} models, and {tests} data tests")
    return phrases


def main() -> int:
    if not WAREHOUSE.exists() or not RUN_RESULTS.exists():
        print("missing target artifacts; run dbt build first", file=sys.stderr)
        return 1
    text = README.read_text(encoding="utf-8")
    missing = [phrase for phrase in required_phrases() if phrase not in text]
    if missing:
        print("README is missing figures from the seeded run:", file=sys.stderr)
        for phrase in missing:
            print(f"  {phrase}", file=sys.stderr)
        return 1
    print(f"README quotes {len(required_phrases())} figures from the seeded run")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
