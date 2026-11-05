with flagged as (

    select
        date_day,
        holiday_name

    from {{ ref('dim_date') }}
    where is_mx_public_holiday

),

expected as (

    select
        holiday_date,
        holiday_name

    from {{ ref('stg_mx_holidays') }}

)

select
    flagged.date_day,
    expected.holiday_date
from flagged
full outer join expected
    on flagged.date_day = expected.holiday_date
    and flagged.holiday_name = expected.holiday_name
where flagged.date_day is null
    or expected.holiday_date is null
