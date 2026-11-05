select orders.order_date as missing_date
from {{ ref('fct_orders') }} as orders
where orders.order_date not in (
    select date_day from {{ ref('dim_date') }}
)

union

select inventory.inventory_date
from {{ ref('fct_inventory_daily') }} as inventory
where inventory.inventory_date not in (
    select date_day from {{ ref('dim_date') }}
)
