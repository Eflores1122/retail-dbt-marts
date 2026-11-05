with source as (

    select * from {{ ref('customers') }}

),

staged as (

    select
        cast(customer_id as integer) as customer_id,
        trim(given_name) as given_name,
        trim(family_name) as family_name,
        trim(given_name) || ' ' || trim(family_name) as full_name,
        lower(trim(email)) as email,
        trim(city) as city,
        upper(trim(state_code)) as state_code,
        cast(registered_on as date) as registered_on

    from source

)

select * from staged
