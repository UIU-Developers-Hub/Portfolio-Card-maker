from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserProfile

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['username'] = user.username
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')
        read_only_fields = ('id',)

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate(self, attrs):
        # Check if email already exists
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({
                "email": "User with this email already exists."
            })
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(
        max_length=128,
        write_only=True,
        style={'input_type': 'password'}
    )

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password.')
            if not user.is_active:
                raise serializers.ValidationError('This user has been deactivated.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        data['user'] = user
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(source='user.first_name', required=False, allow_blank=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    title = serializers.CharField(required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    location = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = UserProfile
        fields = ('fullName', 'email', 'title', 'bio', 'location', 'website', 'phone')

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        # Update first_name from fullName
        if 'first_name' in user_data:
            instance.user.first_name = user_data['first_name']
            instance.user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

    def to_representation(self, instance):
        """
        Ensure fullName is always returned from first_name
        """
        ret = super().to_representation(instance)
        ret['fullName'] = instance.user.first_name or ''
        return ret
