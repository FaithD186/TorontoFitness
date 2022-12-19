from rest_framework import serializers
from rest_framework.fields import ChoiceField

from accounts.serializers import ProfileSerializer
from subscriptions.models import Membership, UserMembership, CardInfo, PaymentInfo


class CardInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardInfo
        fields = ("card_num", "card_expiry_month", "card_expiry_year", "card_cvv")

    def create(self, validated_data):
        return CardInfo.objects.create(**validated_data)


class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ("id", "membership", "price")


class UserMembershipSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    card = CardInfoSerializer()
    membership = MembershipSerializer()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        memberships = Membership.objects.all()
        self.fields['membership'] = ChoiceField(choices=[membership.id for membership in memberships])

    def get_user(self, *args, **kwargs):
        request = self.context.get('request', None)
        return ProfileSerializer(request.user).data
        # return request.user

    class Meta:
        model = UserMembership
        fields = ("user", "membership", "subscription_date", "card")


class PaymentInfoSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    card = CardInfoSerializer()
    class Meta:
        model = PaymentInfo
        fields = ("user", "amount", "date", "card")

    def get_user(self, *args, **kwargs):
        request = self.context.get('request', None)
        return request.user

    def get_card(self, *args, **kwargs):
        request = self.context.get('request', None)
        user = request.user
        user_membership = UserMembership.objects.filter(user=self.request.user).first()
        return user_membership.card


class UpdateUserMembershipSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer()
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        memberships = Membership.objects.all()
        self.fields['membership'] = ChoiceField(choices=[membership for membership in memberships])

    def get_membership(self, *args, **kwargs):
        request = self.context.get('request', None)

        return MembershipSerializer(request.data['membership']).data

    class Meta:
        model = UserMembership
        fields = ("membership",)
