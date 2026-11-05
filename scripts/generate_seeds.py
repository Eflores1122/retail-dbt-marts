#!/usr/bin/env python3
"""Write the Mercado Alba CSV seeds.

One ``random.Random(42)`` stream, consumed in this order: customers, orders,
inventory. Product prices and the store list are fixed formulas, not draws
from that stream. Re-running the script reproduces the committed files.
``--check`` exits non-zero when a seed file differs.
"""

from __future__ import annotations

import argparse
import csv
import io
import random
import sys
from collections.abc import Mapping, Sequence
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED_DIR = ROOT / "seeds"
RNG_SEED = 42

WINDOW_START = date(2026, 1, 1)
WINDOW_END = date(2026, 3, 31)
CUSTOMER_COUNT = 400
ACTIVE_CUSTOMER_MAX_ID = 340
PRODUCTS_PER_CATEGORY = 6

HOLIDAYS: tuple[tuple[date, str], ...] = (
    (date(2026, 1, 1), "Año Nuevo"),
    (date(2026, 2, 2), "Día de la Constitución"),
    (date(2026, 3, 16), "Natalicio de Benito Juárez"),
)
HOLIDAY_DATES = frozenset(day for day, _name in HOLIDAYS)

# ISO 3166-2:MX codes. Cities are real place names; the people are not.
CUSTOMER_STATES: tuple[tuple[str, tuple[str, ...], int], ...] = (
    ("CMX", ("Ciudad de Mexico",), 16),
    ("MEX", ("Toluca", "Ecatepec", "Naucalpan"), 12),
    ("JAL", ("Guadalajara", "Zapopan"), 14),
    ("NLE", ("Monterrey", "San Pedro Garza Garcia"), 12),
    ("PUE", ("Puebla",), 8),
    ("YUC", ("Merida",), 8),
    ("BCN", ("Tijuana", "Mexicali"), 8),
    ("GUA", ("Leon",), 8),
    ("QUE", ("Queretaro",), 8),
    ("VER", ("Veracruz", "Xalapa"), 6),
)

GIVEN_NAMES: tuple[str, ...] = (
    "Ana",
    "Luis",
    "Carmen",
    "Jose",
    "Maria",
    "Diego",
    "Sofia",
    "Miguel",
    "Valeria",
    "Jorge",
    "Lucia",
    "Pedro",
    "Fernanda",
    "Andres",
    "Paula",
    "Ricardo",
    "Elena",
    "Hugo",
    "Renata",
    "Oscar",
    "Daniela",
    "Emilio",
    "Camila",
    "Raul",
    "Regina",
    "Ivan",
    "Ximena",
    "Mateo",
    "Natalia",
    "Adrian",
)

# category, perishable, (subcategory, unit_label)
CATEGORIES: tuple[tuple[str, bool, tuple[tuple[str, str], ...]], ...] = (
    ("abarrotes", False, (("arroz", "kg"), ("frijol", "kg"), ("aceite", "litro"))),
    ("lacteos", True, (("leche", "litro"), ("yogurt", "pieza"), ("queso", "kg"))),
    (
        "frutas_verduras",
        True,
        (("fruta", "kg"), ("verdura", "kg"), ("hierba", "pieza")),
    ),
    ("carnes", True, (("pollo", "kg"), ("res", "kg"), ("cerdo", "kg"))),
    ("bebidas", False, (("agua", "litro"), ("jugo", "litro"), ("refresco", "litro"))),
    (
        "limpieza",
        False,
        (("detergente", "pieza"), ("jabon", "pieza"), ("cloro", "litro")),
    ),
    (
        "cuidado_personal",
        False,
        (("shampoo", "pieza"), ("crema", "pieza"), ("jabon", "pieza")),
    ),
    ("panaderia", True, (("pan", "pieza"), ("bolillo", "pieza"), ("tortilla", "kg"))),
)

STORES: tuple[tuple[int, str, str, str, str, date], ...] = (
    (1, "Mercado Alba Digital", "online", "Ciudad de Mexico", "CMX", date(2023, 3, 1)),
    (2, "Tienda Sintetica Guadalajara", "physical", "Guadalajara", "JAL", date(2022, 6, 15)),
    (3, "Tienda Sintetica Monterrey", "physical", "Monterrey", "NLE", date(2022, 8, 1)),
    (4, "Tienda Sintetica Puebla", "physical", "Puebla", "PUE", date(2023, 1, 20)),
    (5, "Tienda Sintetica Merida", "physical", "Merida", "YUC", date(2023, 5, 4)),
    (6, "Tienda Sintetica Tijuana", "physical", "Tijuana", "BCN", date(2023, 9, 11)),
    (7, "Tienda Sintetica Leon", "physical", "Leon", "GUA", date(2024, 2, 1)),
    (8, "Tienda Sintetica Queretaro", "physical", "Queretaro", "QUE", date(2024, 7, 18)),
)
STORE_WEIGHTS = (28, 12, 12, 10, 10, 10, 9, 9)

CUSTOMER_FIELDS = (
    "customer_id",
    "given_name",
    "family_name",
    "email",
    "city",
    "state_code",
    "registered_on",
)
PRODUCT_FIELDS = (
    "product_id",
    "sku",
    "product_name",
    "category",
    "subcategory",
    "unit_label",
    "unit_price_centavos",
    "unit_cost_centavos",
    "is_perishable",
)
STORE_FIELDS = (
    "store_id",
    "store_name",
    "channel",
    "city",
    "state_code",
    "opened_on",
)
ORDER_FIELDS = ("order_id", "customer_id", "store_id", "ordered_at", "status")
ORDER_LINE_FIELDS = (
    "order_line_id",
    "order_id",
    "product_id",
    "line_type",
    "quantity",
    "unit_price_centavos",
)
INVENTORY_FIELDS = (
    "inventory_date",
    "store_id",
    "product_id",
    "on_hand_units",
    "reserved_units",
)
HOLIDAY_FIELDS = ("holiday_date", "holiday_name")


def _daterange(start: date, end: date) -> list[date]:
    days: list[date] = []
    cursor = start
    while cursor <= end:
        days.append(cursor)
        cursor += timedelta(days=1)
    return days


def _state_picker() -> tuple[tuple[str, tuple[str, ...]], ...]:
    weighted: list[tuple[str, tuple[str, ...]]] = []
    for state_code, cities, weight in CUSTOMER_STATES:
        weighted.extend([(state_code, cities)] * weight)
    return tuple(weighted)


def build_customers(rng: random.Random) -> list[dict[str, object]]:
    states = _state_picker()
    registration_origin = date(2024, 3, 1)
    registration_span = (date(2025, 12, 20) - registration_origin).days
    rows: list[dict[str, object]] = []
    for customer_id in range(1, CUSTOMER_COUNT + 1):
        state_code, cities = rng.choice(states)
        registered = registration_origin + timedelta(days=rng.randint(0, registration_span))
        rows.append(
            {
                "customer_id": customer_id,
                "given_name": GIVEN_NAMES[(customer_id - 1) % len(GIVEN_NAMES)],
                "family_name": f"Sintetico{customer_id:04d}",
                "email": f"cliente.sintetico.{customer_id:04d}@sintetico.invalid",
                "city": cities[(customer_id - 1) % len(cities)],
                "state_code": state_code,
                "registered_on": registered.isoformat(),
            }
        )
    return rows


def build_products() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    product_id = 0
    for category, perishable, subcategories in CATEGORIES:
        for index in range(PRODUCTS_PER_CATEGORY):
            product_id += 1
            subcategory, unit_label = subcategories[index % len(subcategories)]
            price_pesos = 15 + ((product_id * 37) % 360)
            unit_price = price_pesos * 100
            cost_ratio = 60 + ((product_id * 7) % 23)
            unit_cost = unit_price * cost_ratio // 100
            rows.append(
                {
                    "product_id": product_id,
                    "sku": f"MA-{product_id:05d}",
                    "product_name": f"{subcategory.capitalize()} sintetico {product_id:05d}",
                    "category": category,
                    "subcategory": subcategory,
                    "unit_label": unit_label,
                    "unit_price_centavos": unit_price,
                    "unit_cost_centavos": unit_cost,
                    "is_perishable": "true" if perishable else "false",
                }
            )
    return rows


def build_stores() -> list[dict[str, object]]:
    return [
        {
            "store_id": store_id,
            "store_name": store_name,
            "channel": channel,
            "city": city,
            "state_code": state_code,
            "opened_on": opened_on.isoformat(),
        }
        for store_id, store_name, channel, city, state_code, opened_on in STORES
    ]


def build_holidays() -> list[dict[str, object]]:
    return [{"holiday_date": day.isoformat(), "holiday_name": name} for day, name in HOLIDAYS]


def _orders_on(day: date, rng: random.Random) -> int:
    if day in HOLIDAY_DATES:
        base = 6
    elif day.weekday() == 6:
        base = 9
    elif day.weekday() == 5:
        base = 14
    else:
        base = 18
    return base + rng.randint(-2, 2)


def build_orders(
    rng: random.Random,
    products: Sequence[Mapping[str, object]],
) -> tuple[list[dict[str, object]], list[dict[str, object]]]:
    price_by_id = {int(row["product_id"]): int(row["unit_price_centavos"]) for row in products}
    product_ids = list(price_by_id)
    store_ids = [store_id for store_id, *_rest in STORES]
    orders: list[dict[str, object]] = []
    lines: list[dict[str, object]] = []
    order_id = 0
    line_id = 0
    for day in _daterange(WINDOW_START, WINDOW_END):
        for _ in range(_orders_on(day, rng)):
            order_id += 1
            draw = rng.random()
            if draw < 0.55:
                customer_id = rng.randint(1, 200)
            elif draw < 0.85:
                customer_id = rng.randint(201, 300)
            else:
                customer_id = rng.randint(301, ACTIVE_CUSTOMER_MAX_ID)
            store_id = rng.choices(store_ids, weights=STORE_WEIGHTS, k=1)[0]
            status = "cancelled" if rng.random() < 0.04 else "completed"
            local_at = datetime(
                day.year,
                day.month,
                day.day,
                rng.randint(10, 20),
                rng.randint(0, 59),
                rng.randint(0, 59),
            )
            ordered_at = local_at + timedelta(hours=6)
            orders.append(
                {
                    "order_id": order_id,
                    "customer_id": customer_id,
                    "store_id": store_id,
                    "ordered_at": ordered_at.strftime("%Y-%m-%dT%H:%M:%S"),
                    "status": status,
                }
            )
            for product_id in rng.sample(product_ids, rng.randint(1, 4)):
                line_id += 1
                if status == "completed" and rng.random() < 0.06:
                    line_type = "return"
                    quantity = rng.randint(1, 2)
                else:
                    line_type = "sale"
                    quantity = rng.randint(1, 3)
                lines.append(
                    {
                        "order_line_id": line_id,
                        "order_id": order_id,
                        "product_id": product_id,
                        "line_type": line_type,
                        "quantity": quantity,
                        "unit_price_centavos": price_by_id[product_id],
                    }
                )
    return orders, lines


def build_inventory(
    rng: random.Random, products: Sequence[Mapping[str, object]]
) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    days = _daterange(WINDOW_START, WINDOW_END)
    for store_id, *_rest in STORES:
        for product in products:
            level = rng.randint(8, 40)
            for day in days:
                if rng.random() < 0.06:
                    on_hand = 0
                    level = rng.randint(4, 24)
                else:
                    level = min(80, max(0, level + rng.randint(-3, 4)))
                    on_hand = level
                reserved = 0 if on_hand == 0 else rng.randint(0, min(4, on_hand))
                rows.append(
                    {
                        "inventory_date": day.isoformat(),
                        "store_id": store_id,
                        "product_id": int(product["product_id"]),
                        "on_hand_units": on_hand,
                        "reserved_units": reserved,
                    }
                )
    return rows


def render_csv(fields: Sequence[str], rows: Sequence[Mapping[str, object]]) -> str:
    buffer = io.StringIO(newline="")
    writer = csv.DictWriter(buffer, fieldnames=list(fields), lineterminator="\n")
    writer.writeheader()
    for row in rows:
        writer.writerow({field: row[field] for field in fields})
    return buffer.getvalue()


def build_files() -> dict[str, str]:
    rng = random.Random(RNG_SEED)
    customers = build_customers(rng)
    products = build_products()
    stores = build_stores()
    holidays = build_holidays()
    orders, lines = build_orders(rng, products)
    inventory = build_inventory(rng, products)
    return {
        "customers.csv": render_csv(CUSTOMER_FIELDS, customers),
        "products.csv": render_csv(PRODUCT_FIELDS, products),
        "stores.csv": render_csv(STORE_FIELDS, stores),
        "mx_holidays.csv": render_csv(HOLIDAY_FIELDS, holidays),
        "orders.csv": render_csv(ORDER_FIELDS, orders),
        "order_lines.csv": render_csv(ORDER_LINE_FIELDS, lines),
        "inventory_snapshots.csv": render_csv(INVENTORY_FIELDS, inventory),
    }


def check_files(files: Mapping[str, str]) -> int:
    mismatched: list[str] = []
    for name, content in files.items():
        path = SEED_DIR / name
        if not path.exists() or path.read_text(encoding="utf-8") != content:
            mismatched.append(name)
    if mismatched:
        print("seed drift: " + ", ".join(mismatched), file=sys.stderr)
        return 1
    print(f"{len(files)} seed files match the generator")
    return 0


def write_files(files: Mapping[str, str]) -> None:
    SEED_DIR.mkdir(parents=True, exist_ok=True)
    for name, content in files.items():
        (SEED_DIR / name).write_text(content, encoding="utf-8")
        print(f"wrote seeds/{name} ({content.count(chr(10)) - 1} rows)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Write or check Mercado Alba seeds.")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Compare seeds/ to the generator and do not write.",
    )
    return parser.parse_args()


def main() -> int:
    files = build_files()
    if parse_args().check:
        return check_files(files)
    write_files(files)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
