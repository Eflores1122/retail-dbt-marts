select customer_id
from {{ ref('dim_customer') }}
where (completed_order_count = 0 and (first_order_date is not null or last_order_date is not null))
    or (completed_order_count > 0 and (first_order_date is null or last_order_date is null))
    or (first_order_date is not null and first_order_date < registered_on)
    or (first_order_date is not null and last_order_date < first_order_date)
    or completed_sale_orders > completed_order_count
