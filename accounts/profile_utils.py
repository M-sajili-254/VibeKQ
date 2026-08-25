from .models import PassengerProfile


def get_or_create_passenger_profile(user):
    if getattr(user, "user_type", None) != "passenger":
        return None
    profile, _ = PassengerProfile.objects.get_or_create(user=user)
    return profile


def get_active_destination(user):
    profile = PassengerProfile.objects.filter(user=user).select_related("current_destination").first()
    if profile and profile.current_destination:
        return profile.current_destination

    verification = (
        user.ticket_verifications.filter(
            verification_status="verified",
            linked_destination__isnull=False,
        )
        .select_related("linked_destination")
        .order_by("-verified_at", "-created_at")
        .first()
    )
    if verification:
        return verification.linked_destination

    return None
