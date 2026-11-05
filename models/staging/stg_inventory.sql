with source as (

    select * from {{ ref('inventory_snapshots') }}

),

staged as (

    select
        cast(inventory_date as date) as inventory_date,
        cast(store_id as integer) as store_id,
        cast(product_id as integer) as product_id,
        cast(on_hand_units as integer) as on_hand_units,
        cast(reserved_units as integer) as reserved_units

    from source

)

select * from staged
