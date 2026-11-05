with source as (

    select * from {{ ref('stores') }}

),

staged as (

    select
        cast(store_id as integer) as store_id,
        trim(store_name) as store_name,
        lower(trim(channel)) as channel,
        trim(city) as city,
        upper(trim(state_code)) as state_code,
        cast(opened_on as date) as opened_on

    from source

)

select * from staged
