with expected as (

    select
        order_date,
        count(distinct order_id) as orders,
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
        ) as net_sales_centavos

    from {{ ref('fct_order_lines') }}
    group by order_date

)

select days.order_date
from {{ ref('mart_daily_sales') }} as days
left join expected
    on days.order_date = expected.order_date
where days.orders != coalesce(expected.orders, 0)
    or days.gmv_centavos != coalesce(expected.gmv_centavos, 0)
    or days.net_sales_centavos != coalesce(expected.net_sales_centavos, 0)
    or days.orders = 0
