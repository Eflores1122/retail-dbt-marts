select
    inventory_date,
    store_id,
    product_id
from {{ ref('fct_inventory_daily') }}
where available_units != on_hand_units - reserved_units
    or reserved_units > on_hand_units
    or on_hand_units < 0
    or reserved_units < 0
    or (is_stockout and available_units > 0)
    or (not is_stockout and available_units <= 0)
