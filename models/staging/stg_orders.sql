with source as (

    select * from {{ ref('orders') }}

),

staged as (

    select
        cast(order_id as integer) as order_id,
        cast(customer_id as integer) as customer_id,
        cast(store_id as integer) as store_id,
        cast(ordered_at as timestamp) as ordered_at_utc,
        cast(
            cast(ordered_at as timestamp)
            - interval '{{ var("mx_utc_offset_hours") }} hours' as date
        ) as order_date,
        lower(trim(status)) as status

    from source

)

select * from staged
