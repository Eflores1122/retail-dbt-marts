with source as (

    select * from {{ ref('order_lines') }}

),

staged as (

    select
        cast(order_line_id as integer) as order_line_id,
        cast(order_id as integer) as order_id,
        cast(product_id as integer) as product_id,
        lower(trim(line_type)) as line_type,
        cast(quantity as integer) as quantity,
        cast(unit_price_centavos as bigint) as unit_price_centavos

    from source

)

select * from staged
