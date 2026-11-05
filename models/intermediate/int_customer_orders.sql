with completed as (

    select * from {{ ref('int_orders') }}
    where status = 'completed'

)

select
    customer_id,
    min(order_date) as first_order_date,
    max(order_date) as last_order_date,
    count(*) as completed_order_count,
    sum(case when gross_sales_centavos > 0 then 1 else 0 end) as completed_sale_orders,
    sum(gross_sales_centavos) as gmv_centavos,
    sum(net_sales_centavos) as net_sales_centavos

from completed
group by customer_id
