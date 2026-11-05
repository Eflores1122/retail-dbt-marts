select customer_id
from {{ ref('dim_customer') }}
where not (
    (customer_segment = 'none' and completed_order_count = 0)
    or (customer_segment = 'one_time' and completed_order_count = 1)
    or (
        customer_segment = 'returning'
        and completed_order_count between 2 and {{ var("segment_returning_max_orders") }}
    )
    or (
        customer_segment = 'frequent'
        and completed_order_count > {{ var("segment_returning_max_orders") }}
    )
)
