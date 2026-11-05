with products as (

    select
        sum(gmv_centavos) as gmv_centavos,
        sum(net_sales_centavos) as net_sales_centavos,
        sum(units_sold) as units_sold

    from {{ ref('mart_product_performance') }}

),

kpis as (

    select
        gmv_centavos,
        net_sales_centavos,
        units_sold

    from {{ ref('mart_business_kpis') }}

)

select products.gmv_centavos
from products
cross join kpis
where products.gmv_centavos != kpis.gmv_centavos
    or products.net_sales_centavos != kpis.net_sales_centavos
    or products.units_sold != kpis.units_sold
