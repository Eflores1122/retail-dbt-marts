with customers as (

    select * from {{ ref('stg_customers') }}

),

history as (

    select * from {{ ref('int_customer_orders') }}

)

select
    customers.customer_id,
    customers.given_name,
    customers.family_name,
    customers.full_name,
    customers.email,
    customers.city,
    customers.state_code,
    customers.registered_on,
    coalesce(history.completed_order_count, 0) as completed_order_count,
    coalesce(history.completed_sale_orders, 0) as completed_sale_orders,
    coalesce(history.gmv_centavos, 0) as gmv_centavos,
    coalesce(history.net_sales_centavos, 0) as net_sales_centavos,
    history.first_order_date,
    history.last_order_date,
    case
        when coalesce(history.completed_order_count, 0) = 0 then 'none'
        when history.completed_order_count = 1 then 'one_time'
        when history.completed_order_count <= {{ var("segment_returning_max_orders") }} then 'returning'
        else 'frequent'
    end as customer_segment

from customers
left join history
    on customers.customer_id = history.customer_id
