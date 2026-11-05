with lines as (

    select * from {{ ref('fct_order_lines') }}

),

orders as (

    select * from {{ ref('fct_orders') }}

),

customers as (

    select * from {{ ref('dim_customer') }}

),

latest_inventory as (

    select max(inventory_date) as inventory_date
    from {{ ref('fct_inventory_daily') }}

),

stock as (

    select
        count(*) as inventory_positions,
        sum(case when inventory.available_units > 0 then 1 else 0 end) as in_stock_positions

    from {{ ref('fct_inventory_daily') }} as inventory
    inner join latest_inventory
        on inventory.inventory_date = latest_inventory.inventory_date

),

line_totals as (

    select
        coalesce(
            sum(
                case
                    when status = 'completed' and line_type = 'sale'
                        then line_amount_centavos
                    else 0
                end
            ),
            0
        ) as gmv_centavos,
        coalesce(
            sum(
                case
                    when status = 'completed' and line_type = 'return'
                        then line_amount_centavos
                    else 0
                end
            ),
            0
        ) as return_amount_centavos,
        coalesce(
            sum(case when status = 'completed' then line_amount_centavos else 0 end),
            0
        ) as net_sales_centavos,
        coalesce(
            sum(case when status = 'completed' then margin_centavos else 0 end),
            0
        ) as margin_centavos,
        coalesce(
            sum(
                case
                    when status = 'completed' and line_type = 'sale'
                        then signed_quantity
                    else 0
                end
            ),
            0
        ) as units_sold,
        coalesce(
            sum(
                case
                    when status = 'completed'
                        and line_type = 'sale'
                        and channel = 'online'
                        then line_amount_centavos
                    else 0
                end
            ),
            0
        ) as online_gmv_centavos,
        count(*) as order_lines,
        count(
            distinct case
                when status = 'completed' and line_type = 'sale' then customer_id
            end
        ) as active_customers

    from lines

),

order_totals as (

    select
        count(*) as orders,
        sum(case when is_completed then 1 else 0 end) as completed_orders,
        sum(case when is_completed_sale then 1 else 0 end) as completed_sale_orders,
        sum(case when status = 'cancelled' then 1 else 0 end) as cancelled_orders

    from orders

),

customer_totals as (

    select
        count(*) as customers,
        sum(case when customer_segment = 'none' then 1 else 0 end) as customers_none,
        sum(case when customer_segment = 'one_time' then 1 else 0 end) as customers_one_time,
        sum(case when customer_segment = 'returning' then 1 else 0 end) as customers_returning,
        sum(case when customer_segment = 'frequent' then 1 else 0 end) as customers_frequent

    from customers

)

select
    cast('{{ var("as_of_date") }}' as date) as as_of_date,
    cast('{{ var("calendar_start") }}' as date) as window_start,
    cast('{{ var("as_of_date") }}' as date) as window_end,
    customer_totals.customers,
    customer_totals.customers_none,
    customer_totals.customers_one_time,
    customer_totals.customers_returning,
    customer_totals.customers_frequent,
    line_totals.active_customers,
    order_totals.orders,
    order_totals.completed_orders,
    order_totals.completed_sale_orders,
    order_totals.cancelled_orders,
    line_totals.order_lines,
    line_totals.gmv_centavos,
    line_totals.return_amount_centavos,
    line_totals.net_sales_centavos,
    line_totals.margin_centavos,
    line_totals.units_sold,
    line_totals.online_gmv_centavos,
    {{ centavos_to_mxn('line_totals.gmv_centavos') }} as gmv_mxn,
    {{ centavos_to_mxn('line_totals.net_sales_centavos') }} as net_sales_mxn,
    {{ centavos_to_mxn('line_totals.margin_centavos') }} as margin_mxn,
    {{ centavos_to_mxn('line_totals.gmv_centavos') }}
        / order_totals.completed_sale_orders as aov_mxn,
    cast(abs(line_totals.return_amount_centavos) as decimal(18, 6))
        / line_totals.gmv_centavos as return_rate,
    cast(order_totals.cancelled_orders as decimal(18, 6))
        / order_totals.orders as cancel_rate,
    cast(line_totals.online_gmv_centavos as decimal(18, 6))
        / line_totals.gmv_centavos as online_gmv_share,
    (select inventory_date from latest_inventory) as inventory_as_of,
    stock.inventory_positions,
    stock.in_stock_positions,
    cast(stock.in_stock_positions as decimal(18, 6))
        / stock.inventory_positions as in_stock_rate

from line_totals
cross join order_totals
cross join customer_totals
cross join stock
