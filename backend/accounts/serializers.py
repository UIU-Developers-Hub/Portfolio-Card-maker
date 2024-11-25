from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=False)
    fullName = serializers.CharField(required=False, allow_blank=True)
    title = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    website = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'fullName', 'title', 'bio', 'location', 'website', 'phone')
        extra_kwargs = {
            'username': {'required': False},
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        if not value:
            return value
        user = self.instance
        if User.objects.exclude(pk=user.pk if user else None).filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        if 'password' in attrs:
            try:
                validate_password(attrs['password'])
            except ValidationError as e:
                raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

    def create(self, validated_data):
        try:
            fullname = validated_data.pop('fullName', '')
            title = validated_data.pop('title', '')
            bio = validated_data.pop('bio', '')
            location = validated_data.pop('location', '')
            website = validated_data.pop('website', '')
            phone = validated_data.pop('phone', '')

            if not validated_data.get('email') or not validated_data.get('username'):
                raise serializers.ValidationError({
                    "error": "Email and username are required for registration."
                })
            
            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email'],
                first_name=fullname
            )
            if 'password' in validated_data:
                user.set_password(validated_data['password'])
            user.save()

            # Create or update profile
            profile = user.auth_profile
            profile.title = title
            profile.bio = bio
            profile.location = location
            profile.website = website
            profile.phone = phone
            profile.save()

            return user
        except IntegrityError:
            raise serializers.ValidationError({
                "username": ["A user with this username already exists."]
            })

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        
        if 'fullName' in validated_data:
            instance.first_name = validated_data.pop('fullName')

        # Update user fields
        for attr, value in validated_data.items():
            if hasattr(instance, attr):
                setattr(instance, attr, value)

        # Update profile fields
        profile = instance.auth_profile
        if 'title' in validated_data:
            profile.title = validated_data.pop('title')
        if 'bio' in validated_data:
            profile.bio = validated_data.pop('bio')
        if 'location' in validated_data:
            profile.location = validated_data.pop('location')
        if 'website' in validated_data:
            profile.website = validated_data.pop('website')
        if 'phone' in validated_data:
            profile.phone = validated_data.pop('phone')
        
        instance.save()
        profile.save()
        return instance

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        profile = instance.auth_profile
        ret['fullName'] = instance.first_name
        ret['title'] = profile.title
        ret['bio'] = profile.bio
        ret['location'] = profile.location
        ret['website'] = profile.website
        ret['phone'] = profile.phone
        return ret

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({"new_password": list(e.messages)})
        return attrs
