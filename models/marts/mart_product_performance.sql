with products as (

    select * from {{ ref('dim_product') }}

),

lines as (

    select * from {{ ref('fct_order_lines') }}
    where status = 'completed'

),

sales as (

    select
        product_id,
        sum(case when line_type = 'sale' then signed_quantity else 0 end) as units_sold,
        sum(case when line_type = 'return' then -signed_quantity else 0 end) as units_returned,
        sum(case when line_type = 'sale' then line_amount_centavos else 0 end) as gmv_centavos,
        sum(line_amount_centavos) as net_sales_centavos,
        sum(margin_centavos) as margin_centavos,
        count(distinct case when line_type = 'sale' then order_id end) as orders_with_sale

    from lines
    group by product_id

),

stockouts as (

    select
        product_id,
        count(*) as inventory_positions,
        sum(case when is_stockout then 1 else 0 end) as stockout_positions

    from {{ ref('fct_inventory_daily') }}
    group by product_id

)

select
    products.product_id,
    products.sku,
    products.product_name,
    products.category,
    products.subcategory,
    products.price_band,
    products.is_perishable,
    coalesce(sales.units_sold, 0) as units_sold,
    coalesce(sales.units_returned, 0) as units_returned,
    coalesce(sales.gmv_centavos, 0) as gmv_centavos,
    coalesce(sales.net_sales_centavos, 0) as net_sales_centavos,
    coalesce(sales.margin_centavos, 0) as margin_centavos,
    coalesce(sales.orders_with_sale, 0) as orders_with_sale,
    {{ centavos_to_mxn('coalesce(sales.gmv_centavos, 0)') }} as gmv_mxn,
    {{ centavos_to_mxn('coalesce(sales.net_sales_centavos, 0)') }} as net_sales_mxn,
    {{ centavos_to_mxn('coalesce(sales.margin_centavos, 0)') }} as margin_mxn,
    case
        when coalesce(sales.gmv_centavos, 0) = 0 then null
        else cast(sales.margin_centavos as decimal(18, 6)) / sales.gmv_centavos
    end as margin_rate,
    stockouts.inventory_positions,
    stockouts.stockout_positions

from products
left join sales
    on products.product_id = sales.product_id
left join stockouts
    on products.product_id = stockouts.product_id
