with lines as (

    select
        order_id,
        sum(case when line_type = 'sale' then line_amount_centavos else 0 end) as gross_sales_centavos,
        sum(case when line_type = 'return' then line_amount_centavos else 0 end) as return_amount_centavos,
        sum(line_amount_centavos) as net_sales_centavos,
        sum(case when line_type = 'sale' then signed_quantity else 0 end) as units_sold,
        sum(signed_quantity) as units_net,
        sum(margin_centavos) as margin_centavos,
        count(*) as line_count

    from {{ ref('fct_order_lines') }}
    group by order_id

)

select orders.order_id
from {{ ref('fct_orders') }} as orders
inner join lines
    on orders.order_id = lines.order_id
where orders.gross_sales_centavos != lines.gross_sales_centavos
    or orders.return_amount_centavos != lines.return_amount_centavos
    or orders.net_sales_centavos != lines.net_sales_centavos
    or orders.units_sold != lines.units_sold
    or orders.units_net != lines.units_net
    or orders.margin_centavos != lines.margin_centavos
    or orders.line_count != lines.line_count
