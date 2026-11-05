{% if target.type == 'duckdb' %}
{{ config(
    indexes=[
        {'columns': ['order_date']},
        {'columns': ['store_id']}
    ]
) }}
{% elif target.type == 'bigquery' %}
{{ config(
    partition_by={'field': 'order_date', 'data_type': 'date', 'granularity': 'day'},
    cluster_by=['store_id']
) }}
{% endif %}

select
    order_id,
    customer_id,
    store_id,
    order_date,
    ordered_at_utc,
    status,
    channel,
    status = 'completed' as is_completed,
    status = 'completed' and gross_sales_centavos > 0 as is_completed_sale,
    line_count,
    gross_sales_centavos,
    return_amount_centavos,
    net_sales_centavos,
    units_sold,
    units_net,
    margin_centavos,
    {{ centavos_to_mxn('gross_sales_centavos') }} as gross_sales_mxn,
    {{ centavos_to_mxn('return_amount_centavos') }} as return_amount_mxn,
    {{ centavos_to_mxn('net_sales_centavos') }} as net_sales_mxn,
    {{ centavos_to_mxn('margin_centavos') }} as margin_mxn

from {{ ref('int_orders') }}
