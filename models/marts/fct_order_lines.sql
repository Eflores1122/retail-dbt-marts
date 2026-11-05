{% if target.type == 'duckdb' %}
{{ config(
    indexes=[
        {'columns': ['order_date']},
        {'columns': ['store_id', 'product_id']}
    ]
) }}
{% elif target.type == 'bigquery' %}
{{ config(
    partition_by={'field': 'order_date', 'data_type': 'date', 'granularity': 'day'},
    cluster_by=['store_id', 'product_id']
) }}
{% endif %}

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
    line_amount_centavos,
    line_cost_centavos,
    margin_centavos,
    {{ centavos_to_mxn('line_amount_centavos') }} as line_amount_mxn,
    {{ centavos_to_mxn('line_cost_centavos') }} as line_cost_mxn,
    {{ centavos_to_mxn('margin_centavos') }} as margin_mxn,
    category

from {{ ref('int_order_lines') }}
