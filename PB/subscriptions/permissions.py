from rest_framework import permissions
from subscriptions.models import UserMembership


class IsSubscribed(permissions.BasePermission):
    """Permissions for subscribed users."""

    def has_permission(self, request, view):
        user_membership = UserMembership.objects.filter(user=request.user)
        if user_membership:
            return True
        return False

