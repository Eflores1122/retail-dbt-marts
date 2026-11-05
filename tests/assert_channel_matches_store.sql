select lines.order_line_id
from {{ ref('fct_order_lines') }} as lines
inner join {{ ref('dim_store') }} as stores
    on lines.store_id = stores.store_id
where lines.channel != stores.channel

union all

select orders.order_id
from {{ ref('fct_orders') }} as orders
inner join {{ ref('dim_store') }} as stores
    on orders.store_id = stores.store_id
where orders.channel != stores.channel
