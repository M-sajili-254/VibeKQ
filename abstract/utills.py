import logging
import string
from random import randint
from typing import (
    Any,
    Dict,
    List,
)

import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def generate_number(num_digits: int = 6) -> int:
    """
    Generate a pin. of specified length.
    """
    number = 0

    while len(str(number)) != num_digits:
        number = randint(1, (10**num_digits) - 1)

    return number


def generate_promo_code(length: int = 12) -> str:
    characters = string.ascii_uppercase + string.digits
    promo_code = []
    for i in range(length):
        random_index = randint(0, len(characters) - 1)
        letter = characters[random_index]
        promo_code.append(letter)
    return "".join(promo_code)


def get_distance_matrix(origin: Dict[str, float], orders: Any) -> Any:

    try:
        url = "https://api.openrouteservice.org/v2/matrix/driving-hgv"

        body = {
            "locations": [[origin.get("longitude"), origin.get("latitude")]]
            + [
                [
                    order.get("longitude"),
                    order.get("latitude"),
                ]
                for order in orders
            ],
            "metrics": ["distance"],
            "units": "km",
            "destinations": [0],
        }

        headers = {
            "Accept": "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            "Authorization": settings.ORS_API_KEY,
            "Content-Type": "application/json; charset=utf-8",
        }

        response = requests.post(url, headers=headers, json=body)

        if response.status_code != 200:
            raise Exception

        distance_matrix = response.json().get("distances")

        order_distances: List[dict] = [
            {**orders[i], "distance": distance_matrix[i + 1][0]}
            for i in range(len(orders))
        ]

        return sorted(order_distances, key=lambda x: x["distance"])  # type: ignore[no-any-return]

    except Exception as e:
        logger.error(e)
        return orders