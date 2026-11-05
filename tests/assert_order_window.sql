select
    min(order_date) as min_order_date,
    max(order_date) as max_order_date
from {{ ref('fct_orders') }}
having min(order_date) != cast('{{ var("calendar_start") }}' as date)
    or max(order_date) != cast('{{ var("as_of_date") }}' as date)

union all

select
    min(inventory_date) as min_order_date,
    max(inventory_date) as max_order_date
from {{ ref('fct_inventory_daily') }}
having min(inventory_date) != cast('{{ var("calendar_start") }}' as date)
    or max(inventory_date) != cast('{{ var("as_of_date") }}' as date)
