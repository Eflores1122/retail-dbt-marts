with stores as (

    select * from {{ ref('dim_store') }}

),

orders as (

    select * from {{ ref('fct_orders') }}

),

latest_inventory as (

    select max(inventory_date) as inventory_date
    from {{ ref('fct_inventory_daily') }}

),

stock as (

    select
        inventory.store_id,
        count(*) as inventory_positions,
        sum(case when inventory.available_units > 0 then 1 else 0 end) as in_stock_positions,
        sum(inventory.on_hand_cost_centavos) as on_hand_cost_centavos

    from {{ ref('fct_inventory_daily') }} as inventory
    inner join latest_inventory
        on inventory.inventory_date = latest_inventory.inventory_date
    group by inventory.store_id

),

sales as (

    select
        store_id,
        count(*) as orders,
        sum(case when status = 'cancelled' then 1 else 0 end) as cancelled_orders,
        sum(case when is_completed then 1 else 0 end) as completed_orders,
        sum(case when is_completed_sale then 1 else 0 end) as completed_sale_orders,
        sum(case when is_completed then gross_sales_centavos else 0 end) as gmv_centavos,
        sum(case when is_completed then return_amount_centavos else 0 end) as return_amount_centavos,
        sum(case when is_completed then net_sales_centavos else 0 end) as net_sales_centavos,
        sum(case when is_completed then units_sold else 0 end) as units_sold,
        sum(case when is_completed then margin_centavos else 0 end) as margin_centavos

    from orders
    group by store_id

)

select
    stores.store_id,
    stores.store_name,
    stores.channel,
    stores.city,
    stores.state_code,
    stores.region,
    coalesce(sales.orders, 0) as orders,
    coalesce(sales.completed_orders, 0) as completed_orders,
    coalesce(sales.completed_sale_orders, 0) as completed_sale_orders,
    coalesce(sales.cancelled_orders, 0) as cancelled_orders,
    coalesce(sales.gmv_centavos, 0) as gmv_centavos,
    coalesce(sales.return_amount_centavos, 0) as return_amount_centavos,
    coalesce(sales.net_sales_centavos, 0) as net_sales_centavos,
    coalesce(sales.units_sold, 0) as units_sold,
    coalesce(sales.margin_centavos, 0) as margin_centavos,
    {{ centavos_to_mxn('coalesce(sales.gmv_centavos, 0)') }} as gmv_mxn,
    {{ centavos_to_mxn('coalesce(sales.net_sales_centavos, 0)') }} as net_sales_mxn,
    case
        when coalesce(sales.completed_sale_orders, 0) = 0 then null
        else {{ centavos_to_mxn('sales.gmv_centavos') }}
            / sales.completed_sale_orders
    end as aov_mxn,
    case
        when coalesce(sales.orders, 0) = 0 then null
        else cast(sales.cancelled_orders as decimal(18, 6)) / sales.orders
    end as cancel_rate,
    case
        when coalesce(sales.gmv_centavos, 0) = 0 then null
        else cast(abs(sales.return_amount_centavos) as decimal(18, 6))
            / sales.gmv_centavos
    end as return_rate,
    stock.inventory_positions,
    stock.in_stock_positions,
    cast(stock.in_stock_positions as decimal(18, 6))
        / stock.inventory_positions as in_stock_rate,
    stock.on_hand_cost_centavos,
    {{ centavos_to_mxn('stock.on_hand_cost_centavos') }} as on_hand_cost_mxn

from stores
left join sales
    on stores.store_id = sales.store_id
left join stock
    on stores.store_id = stock.store_id
