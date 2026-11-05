select orders.order_id
from {{ ref('fct_orders') }} as orders
left join {{ ref('fct_order_lines') }} as lines
    on orders.order_id = lines.order_id
where lines.order_line_id is null
