with products as (

    select * from {{ ref('stg_products') }}

)

select
    product_id,
    sku,
    product_name,
    category,
    subcategory,
    unit_label,
    unit_price_centavos,
    unit_cost_centavos,
    {{ centavos_to_mxn('unit_price_centavos') }} as unit_price_mxn,
    {{ centavos_to_mxn('unit_cost_centavos') }} as unit_cost_mxn,
    cast(unit_price_centavos - unit_cost_centavos as decimal(18, 6))
        / unit_price_centavos as catalog_margin_rate,
    case
        when unit_price_centavos < {{ var("price_band_value_max_centavos") }} then 'value'
        when unit_price_centavos <= {{ var("price_band_mid_max_centavos") }} then 'mid'
        else 'premium'
    end as price_band,
    is_perishable

from products
