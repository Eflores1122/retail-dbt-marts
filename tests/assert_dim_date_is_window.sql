select
    min(date_day) as min_date_day,
    max(date_day) as max_date_day,
    count(*) as day_count
from {{ ref('dim_date') }}
having min(date_day) != cast('{{ var("calendar_start") }}' as date)
    or max(date_day) != cast('{{ var("as_of_date") }}' as date)
    or count(*) != 90
