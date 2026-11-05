{% if target.type == 'duckdb' %}
{{ config(
    indexes=[
        {'columns': ['inventory_date']},
        {'columns': ['store_id', 'product_id']}
    ]
) }}
{% elif target.type == 'bigquery' %}
{{ config(
    partition_by={'field': 'inventory_date', 'data_type': 'date', 'granularity': 'day'},
    cluster_by=['store_id', 'product_id']
) }}
{% endif %}

select
    inventory_date,
    store_id,
    product_id,
    on_hand_units,
    reserved_units,
    available_units,
    is_stockout,
    on_hand_cost_centavos,
    {{ centavos_to_mxn('on_hand_cost_centavos') }} as on_hand_cost_mxn,
    category

from {{ ref('int_inventory_daily') }}
