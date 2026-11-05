select order_line_id
from {{ ref('fct_order_lines') }}
where (line_type = 'sale' and signed_quantity <= 0)
    or (line_type = 'return' and signed_quantity >= 0)
    or (status = 'cancelled' and line_type != 'sale')
