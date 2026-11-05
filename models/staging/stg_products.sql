with source as (

    select * from {{ ref('products') }}

),

staged as (

    select
        cast(product_id as integer) as product_id,
        upper(trim(sku)) as sku,
        trim(product_name) as product_name,
        lower(trim(category)) as category,
        lower(trim(subcategory)) as subcategory,
        lower(trim(unit_label)) as unit_label,
        cast(unit_price_centavos as bigint) as unit_price_centavos,
        cast(unit_cost_centavos as bigint) as unit_cost_centavos,
        cast(is_perishable as boolean) as is_perishable

    from source

)

select * from staged
