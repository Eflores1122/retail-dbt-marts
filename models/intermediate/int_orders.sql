with lines as (

    select * from {{ ref('int_order_lines') }}

)

select
    order_id,
    customer_id,
    store_id,
    order_date,
    ordered_at_utc,
    status,
    channel,
    count(*) as line_count,
    sum(
        case when line_type = 'sale' then line_amount_centavos else 0 end
    ) as gross_sales_centavos,
    sum(
        case when line_type = 'return' then line_amount_centavos else 0 end
    ) as return_amount_centavos,
    sum(line_amount_centavos) as net_sales_centavos,
    sum(case when line_type = 'sale' then signed_quantity else 0 end) as units_sold,
    sum(signed_quantity) as units_net,
    sum(margin_centavos) as margin_centavos

from lines
group by
    order_id,
    customer_id,
    store_id,
    order_date,
    ordered_at_utc,
    status,
    channel
