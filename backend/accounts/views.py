from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from .serializers import (
    UserSerializer, 
    UserProfileSerializer,
    LoginSerializer,
    RegisterSerializer,
    MyTokenObtainPairSerializer
)
from .models import UserProfile

User = User

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = (AllowAny,)
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create UserProfile for the new user if it doesn't exist
            try:
                UserProfile.objects.get_or_create(user=user)
            except Exception as e:
                # If profile creation fails, delete the user and return error
                user.delete()
                return Response({
                    "error": "Failed to create user profile. Please try again."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "User registered successfully",
                "user": UserSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                except TokenError:
                    pass  # Ignore token errors
            
            return Response(
                {'detail': 'Successfully logged out'}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print(f"Logout error: {str(e)}")
            return Response(
                {'detail': 'Successfully logged out'}, 
                status=status.HTTP_200_OK
            )

class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get(self, request):
        print(f"Authenticated user: {request.user}")  # Debug log
        print(f"Auth header: {request.headers.get('Authorization')}")  # Debug log
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile)
            data = serializer.data
            print(f"Profile data being sent: {data}")  # Debug log
            
            # Wrap the data in a response format matching frontend expectations
            response_data = {
                "data": data,
                "message": "Profile retrieved successfully"
            }
            return Response(response_data, status=status.HTTP_200_OK)
            
        except UserProfile.DoesNotExist:
            print(f"Profile not found for user: {request.user}")  # Debug log
            # Create profile if it doesn't exist
            profile = UserProfile.objects.create(user=request.user)
            serializer = UserProfileSerializer(profile)
            response_data = {
                "data": serializer.data,
                "message": "New profile created"
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error retrieving profile: {str(e)}")  # Debug log
            return Response(
                {
                    "error": "Failed to retrieve profile",
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        print(f"Update data received: {request.data}")  # Debug log
        
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = UserProfileSerializer(profile, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                response_data = {
                    "data": serializer.data,
                    "message": "Profile updated successfully"
                }
                return Response(response_data, status=status.HTTP_200_OK)
            
            print(f"Validation errors: {serializer.errors}")  # Debug log
            return Response(
                {
                    "error": "Invalid data",
                    "detail": serializer.errors
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except UserProfile.DoesNotExist:
            print(f"Profile not found for user: {request.user}")  # Debug log
            return Response(
                {
                    "error": "Profile not found",
                    "detail": "User profile does not exist"
                },
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error updating profile: {str(e)}")  # Debug log
            return Response(
                {
                    "error": "Failed to update profile",
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
