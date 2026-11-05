with stores as (

    select
        sum(gmv_centavos) as gmv_centavos,
        sum(net_sales_centavos) as net_sales_centavos,
        sum(orders) as orders

    from {{ ref('mart_store_scorecard') }}

),

kpis as (

    select
        gmv_centavos,
        net_sales_centavos,
        orders

    from {{ ref('mart_business_kpis') }}

)

select stores.gmv_centavos
from stores
cross join kpis
where stores.gmv_centavos != kpis.gmv_centavos
    or stores.net_sales_centavos != kpis.net_sales_centavos
    or stores.orders != kpis.orders
