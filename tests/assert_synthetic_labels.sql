select customer_id as entity_id, 'customer' as entity
from {{ ref('dim_customer') }}
where email not like '%@sintetico.invalid'
    or family_name not like 'Sintetico%'
    or full_name != (given_name || ' ' || family_name)

union all

select product_id, 'product'
from {{ ref('dim_product') }}
where product_name not like '%sintetico%'
    or sku not like 'MA-%'
    or unit_cost_centavos > unit_price_centavos

union all

select store_id, 'store'
from {{ ref('dim_store') }}
where (channel = 'online' and (store_id != 1 or store_name != 'Mercado Alba Digital'))
    or (channel = 'physical' and store_name not like 'Tienda Sintetica %')
    or (channel = 'online' and region != 'centro')
