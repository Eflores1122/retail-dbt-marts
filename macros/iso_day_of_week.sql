{% macro iso_day_of_week(date_expr) -%}
    {%- if target.type == 'bigquery' -%}
        mod(extract(dayofweek from {{ date_expr }}) + 5, 7) + 1
    {%- else -%}
        isodow({{ date_expr }})
    {%- endif -%}
{%- endmacro %}
