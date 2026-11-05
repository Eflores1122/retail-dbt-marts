select lines.order_line_id
from {{ ref('fct_order_lines') }} as lines
inner join {{ ref('dim_product') }} as products
    on lines.product_id = products.product_id
where lines.unit_price_centavos != products.unit_price_centavos
    or lines.unit_cost_centavos != products.unit_cost_centavos
