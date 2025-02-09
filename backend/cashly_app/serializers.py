from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .models import Expense, Category,Budget

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'phone', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match!"})

        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists!"})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password

        # Create user with hashed password
        return User.objects.create_user(**validated_data)  # Use create_user() instead of create()

    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

# class LoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'phone']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

# class ExpenseSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source='category.name', read_only=True)

#     class Meta:
#         model = Expense
#         fields = ['id', 'amount', 'description', 'date', 'category', 'category_name']
#         read_only_fields = ['user', 'category']

#     def create(self, validated_data):
#         user = self.context['request'].user  # This will now work because 'request' is in the context
#         validated_data['user'] = user
#         # The category will be auto-assigned in the model's save method
#         return super().create(validated_data)
class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['amount', 'description', 'date', 'category', 'user']  # include 'user' field

    def create(self, validated_data):
        # Set the user to the logged-in user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class ExpenseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['date', 'description', 'amount']

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'user', 'amount', 'month', 'created_at', 'updated_at']