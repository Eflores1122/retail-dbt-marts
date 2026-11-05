with days as (

    select date_day as order_date
    from {{ ref('dim_date') }}

),

lines as (

    select * from {{ ref('fct_order_lines') }}

),

daily as (

    select
        order_date,
        count(distinct order_id) as orders,
        count(
            distinct case when status = 'completed' then order_id end
        ) as completed_orders,
        count(
            distinct case
                when status = 'completed' and line_type = 'sale' then order_id
            end
        ) as completed_sale_orders,
        count(
            distinct case when status = 'cancelled' then order_id end
        ) as cancelled_orders,
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
            sum(case when status = 'completed' then line_amount_centavos else 0 end),
            0
        ) as net_sales_centavos,
        coalesce(
            sum(
                case
                    when status = 'completed' and line_type = 'sale'
                        then signed_quantity
                    else 0
                end
            ),
            0
        ) as units_sold

    from lines
    group by order_date

)

select
    days.order_date,
    coalesce(daily.orders, 0) as orders,
    coalesce(daily.completed_orders, 0) as completed_orders,
    coalesce(daily.completed_sale_orders, 0) as completed_sale_orders,
    coalesce(daily.cancelled_orders, 0) as cancelled_orders,
    coalesce(daily.gmv_centavos, 0) as gmv_centavos,
    coalesce(daily.net_sales_centavos, 0) as net_sales_centavos,
    coalesce(daily.units_sold, 0) as units_sold,
    {{ centavos_to_mxn('coalesce(daily.gmv_centavos, 0)') }} as gmv_mxn,
    {{ centavos_to_mxn('coalesce(daily.net_sales_centavos, 0)') }} as net_sales_mxn

from days
left join daily
    on days.order_date = daily.order_date
