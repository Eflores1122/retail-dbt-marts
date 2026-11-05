{% macro centavos_to_mxn(amount_centavos) -%}
cast(cast({{ amount_centavos }} as decimal(18, 2)) / 100 as decimal(18, 2))
{%- endmacro %}
