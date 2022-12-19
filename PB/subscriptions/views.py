from datetime import timedelta, datetime, date, timezone

from django.shortcuts import render
from django.conf import settings
from django.views import View

from django.views.generic import ListView
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from accounts.models import UserProfile
from accounts.serializers import ProfileSerializer
from classes.models import Enrollments, Time
from subscriptions.models import Membership, UserMembership, CardInfo, PaymentInfo
from subscriptions.permissions import IsSubscribed
from subscriptions.serializers import MembershipSerializer, \
    UserMembershipSerializer, CardInfoSerializer, UpdateUserMembershipSerializer, PaymentInfoSerializer

from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView, \
    RetrieveUpdateAPIView, UpdateAPIView, GenericAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny

import json


class ListMembershipView(ListAPIView):
    serializer_class = MembershipSerializer
    permission_classes = [AllowAny,]

    def get_queryset(self):
        memberships = Membership.objects.all()

        # membership_list = []
        # for i in memberships:
        #     membership_json = {
        #             "membership": i.membership,
        #             "price": i.price,
        #             "frequency": i.get_membership_display()
        #         }
        #     membership_list.append(membership_json)
        # return membership_list
        # frequency = membership.get_membership_display()
        return memberships


class SubscriptionView(CreateAPIView):
    """Subscribe a user to a membership."""
    serializer_class = UserMembershipSerializer
    queryset = UserMembership.objects.all()
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body.decode('utf-8'))

        current_membership = UserMembership.objects.filter(user=request.user)
        if current_membership:
            raise PermissionDenied({"message": "You are already subscribed to a membership"})
        
        card = CardInfo.objects.create(card_num=data['card_num'],
                                       card_expiry_month=data['card_expiry_month'],
                                       card_expiry_year=data['card_expiry_year'],
                                       card_cvv=data['card_cvv'])

        membership = Membership.objects.filter(id=kwargs['pk']).first()
        UserMembership.objects.create(user=request.user,
                                      membership=membership,
                                      card=card)

        PaymentInfo.objects.create(
            user=request.user,
            amount=membership.price,
            card=card)

        return Response({'details': f'successfully subscribed to subscription with id {request.POST.get("membership", False)}'})


class EditCardInfoView(UpdateAPIView):
    """Allow a user to update their card info."""
    serializer_class = CardInfoSerializer
    queryset = CardInfo.objects.all()
    permission_classes = [IsAuthenticated, IsSubscribed]

    def get_object(self):
        user = UserMembership.objects.filter(user=self.request.user).first()
        return user.card


class PaymentHistoryView(GenericAPIView):
    """Display payment history for the user."""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_payments = PaymentInfo.objects.filter(user=request.user)
        payment_list = []
        for p in user_payments:
            # c = CardInfo.objects.filter(id=p.card.id).first()
            curr_payement = {
                "amount": p.amount,
                "payment_date": p.date,
                "card": {
                    "card_num": p.card.card_num,
                    "card_expiry_month": p.card.card_expiry_month,
                    "card_expiry_year": p.card.card_expiry_year,
                    "card_cvv": p.card.card_cvv
                }
            }

            payment_list.append(curr_payement)

        payment_list.sort(key=lambda x: p.date)

        return Response({'payments': payment_list})


class PaymentFutureView(GenericAPIView):
    """Generate future payment for the user."""
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_payments = PaymentInfo.objects.filter(user=request.user)
        most_recent_payment = user_payments.latest('date')
        user_membership = UserMembership.objects.filter(user=request.user).first()

        if not user_membership:
            raise PermissionDenied({"message": "You are not subscribed to any subscription."})

        card = user_membership.card

        membership = Membership.objects.filter(id=user_membership.membership.id).first()
        next_payment_date = most_recent_payment.date + timedelta(days=membership.membership)
        future_payement = {
            "amount": most_recent_payment.amount,
            "next_payment_date": next_payment_date,
            "card": {
                "card_num": card.card_num,
                "card_expiry_month": card.card_expiry_month,
                "card_expiry_year": card.card_expiry_year,
                "card_cvv": card.card_cvv
            }
        }

        return Response({"future_payment": future_payement})


class CancelSubscriptionView(DestroyAPIView):
    serializer_class = UserMembershipSerializer
    queryset = UserMembership.objects.all()
    permission_classes = [IsAuthenticated, IsSubscribed]

    def delete(self, request, *args, **kwargs):
        now = datetime.now().replace(tzinfo=timezone(offset=timedelta()))
        all_user_enrollments = Enrollments.objects.filter(enrolled_user=request.user)
        user_membership = UserMembership.objects.filter(user=request.user).first()
        billing_period_end = user_membership.subscription_date
        membership = Membership.objects.filter(id=user_membership.membership.id).first()
        while billing_period_end < now:
            billing_period_end += timedelta(days=membership.membership)
        print(billing_period_end)

        for e in all_user_enrollments:
            enrolled_time = Time.objects.filter(id=e.enrolled_time.id).first()
            enrolled_time = datetime.combine(enrolled_time.class_date, enrolled_time.start_time).replace(tzinfo=timezone(offset=timedelta()))
            if enrolled_time > billing_period_end:
                Enrollments.objects.filter(id=e.id).delete()

        UserMembership.objects.filter(user=request.user).delete()
        return Response(
            {'details': 'successfully cancelled the subscription. All future enrolled classes have been dropped'})


class EditSubscriptionView(GenericAPIView):
    serializer_class = UpdateUserMembershipSerializer
    queryset = UserMembership.objects.all()
    permission_classes = [IsAuthenticated, IsSubscribed]

    # def patch(self, request, *args, **kwargs):
    #     return Response({'details': 'successfully edited the subscription.'})
    # def get_object(self):
    #
    #     user_membership = UserMembership.objects.filter(user=self.request.user).first()
    #     return user_membership

    # def update(self, request, *args, **kwargs):
    #     instance = UserMembership.objects.filter(user=request.user).first()
    #     instance.membership = request.data['membership']
    #     instance.save()
    # return super(EditSubscriptionView, self).update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('membership', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        user_membership = UserMembership.objects.filter(user=request.user)
        user_membership.update(membership=request.data['membership'])
        return Response({"details": "successfully updated the subscription plan."})

        # super(EditSubscriptionView, self).update(request, *args, **kwargs)

        # serializer = self.get_serializer(instance, data=request.data, partial=True)
        # serializer.is_valid(raise_exception=True)
        # self.perform_update(serializer)
        # return Response(serializer.data)
