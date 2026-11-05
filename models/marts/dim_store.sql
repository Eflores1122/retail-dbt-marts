with stores as (

    select * from {{ ref('stg_stores') }}

)

select
    store_id,
    store_name,
    channel,
    city,
    state_code,
    case
        when state_code in ('CMX', 'MEX', 'PUE') then 'centro'
        when state_code = 'JAL' then 'occidente'
        when state_code in ('NLE', 'BCN') then 'norte'
        when state_code in ('GUA', 'QUE') then 'bajio'
        when state_code = 'YUC' then 'sureste'
        when state_code = 'VER' then 'golfo'
    end as region,
    opened_on

from stores
