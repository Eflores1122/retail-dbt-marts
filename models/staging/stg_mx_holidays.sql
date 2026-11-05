with source as (

    select * from {{ ref('mx_holidays') }}

),

staged as (

    select
        cast(holiday_date as date) as holiday_date,
        trim(holiday_name) as holiday_name

    from source

)

select * from staged
