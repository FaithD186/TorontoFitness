import datetime
from django.db import models
from accounts.models import UserProfile


class Membership(models.Model):
    MEMBERSHIP_FREQUENCY = (
        (1, 'Daily'),
        (7, 'Weekly'),
        (30, 'Monthly'),
        (365, 'Yearly')
    )
    id = models.PositiveIntegerField(primary_key=True)
    membership = models.PositiveIntegerField(choices=MEMBERSHIP_FREQUENCY)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    objects = models.Manager()

    def __str__(self):
        string = [freq[1] for freq in self.MEMBERSHIP_FREQUENCY if freq[0] == self.membership]
        return f' ${self.price} ' + string[0]


class CardInfo(models.Model):

    card_num = models.CharField(max_length=16)
    card_expiry_month = models.CharField(max_length=2)
    card_expiry_year = models.CharField(max_length=2)
    card_cvv = models.CharField(max_length=3)
    objects = models.Manager()

    def __str__(self):
        return self.card_num



class UserMembership(models.Model):
    user = models.OneToOneField(UserProfile,
                                on_delete=models.CASCADE)
    membership = models.ForeignKey(Membership,
                                      on_delete=models.CASCADE)
    subscription_date = models.DateTimeField(auto_now_add=True)

    card = models.OneToOneField(CardInfo, on_delete=models.CASCADE)


    objects = models.Manager()

    def __str__(self):
        return self.user.username


class PaymentInfo(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    card = models.ForeignKey(CardInfo, on_delete=models.CASCADE)

    # card_num = models.CharField(max_length=16)
    objects = models.Manager()

    def __str__(self):
        return f'{self.user.username} paid {self.amount} on {self.date}'
