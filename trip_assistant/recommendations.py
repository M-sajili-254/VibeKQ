from typing import List, Sequence, Tuple

from accounts.profile_utils import get_or_create_passenger_profile


def _normalize(values: Sequence[str] | None) -> set[str]:
    if not values:
        return set()
    return {
        str(value).strip().lower()
        for value in values
        if value is not None and str(value).strip()
    }


def score_services_for_profile(user, services) -> List:
    profile = get_or_create_passenger_profile(user)
    if not profile:
        ranked = list(services)
        for service in ranked:
            service.recommendation_score = 0
            service.recommendation_reasons = []
        return ranked

    preferred_categories = _normalize(profile.preferred_categories)
    interests = _normalize(profile.interests)
    travel_styles = _normalize(profile.travel_styles)
    airport_preferences = _normalize(profile.preferred_airport_services)
    local_preferences = _normalize(profile.preferred_local_experiences)
    transport_preferences = _normalize(profile.preferred_transport_modes)
    dietary_preferences = _normalize([profile.dietary_preferences] if profile.dietary_preferences else [])

    ranked: List[Tuple[int, object]] = []
    for service in services:
        score = getattr(service, "priority_score", 0)
        reasons: list[str] = []
        service_tags = _normalize(getattr(service, "tags", []))
        category_name = getattr(service.category, "name", "").strip().lower()

        if category_name and category_name in preferred_categories:
            score += 4
            reasons.append(f"Matches your preference for {service.category.name.lower()}")

        tag_matches = service_tags & interests
        if tag_matches:
            score += 3
            reasons.append(f"Aligned with your interests in {', '.join(sorted(tag_matches)[:2])}")

        if service.community_type == "airport":
            airport_matches = service_tags & airport_preferences
            if airport_matches:
                score += 3
                reasons.append("Useful for your airport experience")
        else:
            local_matches = service_tags & local_preferences
            if local_matches:
                score += 3
                reasons.append("Fits the local experiences you prefer")

        if service_tags & transport_preferences:
            score += 2
            reasons.append("Matches your preferred transport style")

        if service_tags & dietary_preferences:
            score += 2
            reasons.append("Suitable for your dietary preferences")

        if travel_styles:
            if "business" in travel_styles and category_name in {"airport lounge", "airport hotel", "executive transport", "hotel"}:
                score += 2
                reasons.append("Good fit for your business-travel style")
            if "family" in travel_styles and "family" in service_tags:
                score += 2
                reasons.append("Family-friendly option")
            if "adventure" in travel_styles and ("adventure" in service_tags or category_name in {"tour", "events", "activities"}):
                score += 2
                reasons.append("Supports your adventure travel style")
            if "luxury" in travel_styles and ("luxury" in service_tags or "premium" in service_tags):
                score += 2
                reasons.append("Matches your luxury preferences")

        if service.journey_stage == "both":
            score += 1
        if getattr(service, "verified", False):
            score += 1
        if getattr(service, "rating", 0):
            score += float(service.rating)

        service.recommendation_score = round(score, 2)
        service.recommendation_reasons = reasons[:3]
        ranked.append((service.recommendation_score, service))

    ranked.sort(
        key=lambda item: (
            item[0],
            getattr(item[1], "verified", False),
            getattr(item[1], "rating", 0),
            getattr(item[1], "priority_score", 0),
        ),
        reverse=True,
    )
    return [service for _, service in ranked]
