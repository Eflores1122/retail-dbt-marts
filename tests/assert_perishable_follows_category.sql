select product_id
from {{ ref('dim_product') }}
where (
    category in ('lacteos', 'frutas_verduras', 'carnes', 'panaderia')
    and not is_perishable
)
or (
    category in ('abarrotes', 'bebidas', 'limpieza', 'cuidado_personal')
    and is_perishable
)
