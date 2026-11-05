with inventory as (

    select * from {{ ref('stg_inventory') }}

),

products as (

    select
        product_id,
        unit_cost_centavos,
        category

    from {{ ref('stg_products') }}

)

select
    inventory.inventory_date,
    inventory.store_id,
    inventory.product_id,
    inventory.on_hand_units,
    inventory.reserved_units,
    inventory.on_hand_units - inventory.reserved_units as available_units,
    (inventory.on_hand_units - inventory.reserved_units) <= 0 as is_stockout,
    inventory.on_hand_units * products.unit_cost_centavos as on_hand_cost_centavos,
    products.category

from inventory
inner join products
    on inventory.product_id = products.product_id
