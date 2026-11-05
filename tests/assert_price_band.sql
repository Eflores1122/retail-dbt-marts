select product_id
from {{ ref('dim_product') }}
where (
    price_band = 'value'
    and unit_price_centavos >= {{ var("price_band_value_max_centavos") }}
)
or (
    price_band = 'mid'
    and (
        unit_price_centavos < {{ var("price_band_value_max_centavos") }}
        or unit_price_centavos > {{ var("price_band_mid_max_centavos") }}
    )
)
or (
    price_band = 'premium'
    and unit_price_centavos <= {{ var("price_band_mid_max_centavos") }}
)
