-- Published MXN columns are centavos / 100 at two decimal places.
-- A failing row means centavos_to_mxn drifted from the integer amount.

select 'dim_product' as relation_name, cast(product_id as varchar) as entity_id
from {{ ref('dim_product') }}
where unit_price_mxn * 100 != unit_price_centavos
    or unit_cost_mxn * 100 != unit_cost_centavos

union all

select 'fct_order_lines', cast(order_line_id as varchar)
from {{ ref('fct_order_lines') }}
where line_amount_mxn * 100 != line_amount_centavos
    or line_cost_mxn * 100 != line_cost_centavos
    or margin_mxn * 100 != margin_centavos

union all

select 'fct_orders', cast(order_id as varchar)
from {{ ref('fct_orders') }}
where gross_sales_mxn * 100 != gross_sales_centavos
    or return_amount_mxn * 100 != return_amount_centavos
    or net_sales_mxn * 100 != net_sales_centavos
    or margin_mxn * 100 != margin_centavos

union all

select
    'fct_inventory_daily',
    cast(inventory_date as varchar) || ':' || cast(store_id as varchar) || ':' || cast(product_id as varchar)
from {{ ref('fct_inventory_daily') }}
where on_hand_cost_mxn * 100 != on_hand_cost_centavos

union all

select 'mart_business_kpis', 'window'
from {{ ref('mart_business_kpis') }}
where gmv_mxn * 100 != gmv_centavos
    or net_sales_mxn * 100 != net_sales_centavos
    or margin_mxn * 100 != margin_centavos
    or aov_mxn != gmv_mxn / completed_sale_orders

union all

select 'mart_daily_sales', cast(order_date as varchar)
from {{ ref('mart_daily_sales') }}
where gmv_mxn * 100 != gmv_centavos
    or net_sales_mxn * 100 != net_sales_centavos

union all

select 'mart_product_performance', cast(product_id as varchar)
from {{ ref('mart_product_performance') }}
where gmv_mxn * 100 != gmv_centavos
    or net_sales_mxn * 100 != net_sales_centavos
    or margin_mxn * 100 != margin_centavos

union all

select 'mart_store_scorecard', cast(store_id as varchar)
from {{ ref('mart_store_scorecard') }}
where gmv_mxn * 100 != gmv_centavos
    or net_sales_mxn * 100 != net_sales_centavos
    or on_hand_cost_mxn * 100 != on_hand_cost_centavos
    or (
        completed_sale_orders > 0
        and aov_mxn != gmv_mxn / completed_sale_orders
    )
