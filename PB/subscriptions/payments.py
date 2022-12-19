from datetime import datetime, timedelta

from subscriptions.models import UserMembership, PaymentInfo, Membership


def make_all_required_payments_now():
    now = datetime.now()
    subscribed_users = UserMembership.objects.all()
    for u in subscribed_users:
        user = u.user
        user_payments = PaymentInfo.objects.filter(user=user)
        user_latest_payement = user_payments.latest('date')
        user_membership = Membership.objects.filter(id=u.membership)
        while user_latest_payement + timedelta(days=user_membership.membership) < now:
            PaymentInfo.objects.create(
                user=user,
                amount=user_membership.price,
                card=u.card)
            user_latest_payement += timedelta(days=user_membership.membership)
