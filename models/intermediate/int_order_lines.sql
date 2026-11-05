with lines as (

    select * from {{ ref('stg_order_lines') }}

),

orders as (

    select * from {{ ref('stg_orders') }}

),

products as (

    select * from {{ ref('stg_products') }}

),

stores as (

    select * from {{ ref('stg_stores') }}

),

joined as (

    select
        lines.order_line_id,
        lines.order_id,
        orders.customer_id,
        orders.store_id,
        lines.product_id,
        orders.order_date,
        orders.ordered_at_utc,
        orders.status,
        stores.channel,
        lines.line_type,
        case
            when lines.line_type = 'return' then -lines.quantity
            else lines.quantity
        end as signed_quantity,
        lines.unit_price_centavos,
        products.unit_cost_centavos,
        products.category

    from lines
    inner join orders
        on lines.order_id = orders.order_id
    inner join products
        on lines.product_id = products.product_id
    inner join stores
        on orders.store_id = stores.store_id

)

select
    order_line_id,
    order_id,
    customer_id,
    store_id,
    product_id,
    order_date,
    ordered_at_utc,
    status,
    channel,
    line_type,
    signed_quantity,
    unit_price_centavos,
    unit_cost_centavos,
    signed_quantity * unit_price_centavos as line_amount_centavos,
    signed_quantity * unit_cost_centavos as line_cost_centavos,
    (signed_quantity * unit_price_centavos)
        - (signed_quantity * unit_cost_centavos) as margin_centavos,
    category

from joined
