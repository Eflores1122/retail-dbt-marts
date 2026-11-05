with spine as (

    {{ dbt_utils.date_spine(
        datepart="day",
        start_date="cast('" ~ var("calendar_start") ~ "' as date)",
        end_date="cast('" ~ var("calendar_end") ~ "' as date)"
    ) }}

),

days as (

    select cast(date_day as date) as date_day
    from spine

),

holidays as (

    select
        holiday_date,
        holiday_name

    from {{ ref('stg_mx_holidays') }}

)

select
    days.date_day,
    cast(extract(year from days.date_day) as integer) as year_number,
    cast(extract(quarter from days.date_day) as integer) as quarter_number,
    cast(extract(month from days.date_day) as integer) as month_number,
    case cast(extract(month from days.date_day) as integer)
        when 1 then 'January'
        when 2 then 'February'
        when 3 then 'March'
        when 4 then 'April'
        when 5 then 'May'
        when 6 then 'June'
        when 7 then 'July'
        when 8 then 'August'
        when 9 then 'September'
        when 10 then 'October'
        when 11 then 'November'
        when 12 then 'December'
    end as month_name,
    cast({{ iso_day_of_week('days.date_day') }} as integer) as day_of_week,
    cast({{ iso_day_of_week('days.date_day') }} as integer) >= 6 as is_weekend,
    holidays.holiday_date is not null as is_mx_public_holiday,
    holidays.holiday_name

from days
left join holidays
    on days.date_day = holidays.holiday_date
