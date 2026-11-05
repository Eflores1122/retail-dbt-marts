select order_line_id
from {{ ref('fct_order_lines') }}
where line_amount_centavos != signed_quantity * unit_price_centavos
    or line_cost_centavos != signed_quantity * unit_cost_centavos
    or margin_centavos != line_amount_centavos - line_cost_centavos
