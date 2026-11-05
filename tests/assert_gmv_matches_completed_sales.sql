with expected as (

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
            sum(case when status = 'completed' then line_amount_centavos else 0 end),
            0
        ) as net_sales_centavos

    from {{ ref('fct_order_lines') }}

),

actual as (

    select
        gmv_centavos,
        net_sales_centavos

    from {{ ref('mart_business_kpis') }}

)

select
    expected.gmv_centavos,
    actual.gmv_centavos
from expected
cross join actual
where expected.gmv_centavos != actual.gmv_centavos
    or expected.net_sales_centavos != actual.net_sales_centavos
