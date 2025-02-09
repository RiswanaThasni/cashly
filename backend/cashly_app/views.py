from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status, generics, permissions, viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ExpenseSerializer, CategorySerializer, ExpenseListSerializer, BudgetSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Expense, Category, Budget, Income
from django.db.models import Sum
from django.utils.timezone import now
from rest_framework import status

# Create your views here.

User = get_user_model()

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()

                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)

                return Response({
                    "message": "Registration successful!",
                    "token": str(refresh.access_token),
                    "user": {
                        "username": user.username,
                        "email": user.email,
                        "phone": getattr(user, "phone", None)  # Ensure phone exists in User model
                    }
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({
                    "message": "An error occurred during registration.",
                    "error": str(e)
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(request, email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
    
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)  # Decode the refresh token
            token.blacklist()  # Blacklist the refresh token
            
            return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class ExpenseListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all expenses for the logged-in user"""
        # Get query parameters for filtering
        month = request.query_params.get('month')
        category = request.query_params.get('category')

        expenses = Expense.objects.filter(user=request.user)

        # Apply filters if provided
        if month:
            expenses = expenses.filter(date__year=month.split('-')[0], 
                                    date__month=month.split('-')[1])
        if category:
            expenses = expenses.filter(category__name=category)

        # Order by date descending
        expenses = expenses.order_by('-date')

        # Get total amount
        total_amount = expenses.aggregate(total=Sum('amount'))['total'] or 0

        serializer = ExpenseSerializer(expenses, many=True)
        return Response({
            'expenses': serializer.data,
            'total_amount': total_amount
        })

    def post(self, request):
        """Create a new expense"""
        serializer = ExpenseSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            expense = serializer.save()
            # Return the saved expense with its auto-assigned category
            return Response(ExpenseSerializer(expense).data, 
                          status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddExpenseView(APIView):
    permission_classes = []  # No authentication required at the class level

    def post(self, request):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Prepare the data for the expense
        expense_data = {
            'user': request.user.id,  # Use authenticated user's ID
            'amount': request.data.get('amount'),
            'description': request.data.get('description'),
        }

        # Automatically assign a category based on the description
        description = expense_data['description'].lower()
        category_mapping = {
            "food": ["burger", "pizza", "dinner", "lunch", "eat"],
            "transport": ["uber", "bus", "train", "taxi"],
            "entertainment": ["movie", "concert", "game"],
            "salary": ["salary", "paycheck", "income"],
            "groceries": ["walmart", "grocery", "supermarket"],
        }

        assigned_category = None
        for category_name, keywords in category_mapping.items():
            if any(word in description for word in keywords):
                assigned_category, _ = Category.objects.get_or_create(name=category_name, user=request.user)
                break

        if assigned_category:
            expense_data['category'] = assigned_category.id

        # Save expense
        serializer = ExpenseSerializer(data=expense_data, context={'request': request})
        if serializer.is_valid():
            expense = serializer.save()  # Save expense

            # If category is "salary" or any other income-related category, also store it in Income table
            if assigned_category and assigned_category.name == "salary":
                Income.objects.create(
                    user=request.user,
                    source="Salary",  # You can dynamically set this based on the description
                    amount=expense.amount,
                    description=expense.description,
                    date=now().date()
                )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AddExpenseView(APIView):
#     permission_classes = []  # No authentication required at the class level

#     def post(self, request):
#         # Check if the user is authenticated
#         if not request.user.is_authenticated:
#             return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

#         # Prepare the data for the expense
#         expense_data = {
#             'user': request.user.id,  # Use authenticated user's ID
#             'amount': request.data.get('amount'),
#             'description': request.data.get('description'),
#         }

#         # Automatically assign a category based on the description
#         description = expense_data['description'].lower()
#         category_mapping = {
#             "food": ["burger", "pizza", "dinner", "lunch", "eat"],
#             "transport": ["uber", "bus", "train", "taxi"],
#             "entertainment": ["movie", "concert", "game"],
#             "salary": ["salary", "paycheck", "income"],
#             "groceries": ["walmart", "grocery", "supermarket"],
#         }

#         assigned_category = None
#         for category_name, keywords in category_mapping.items():
#             if any(word in description for word in keywords):
#                 assigned_category, _ = Category.objects.get_or_create(name=category_name, user=request.user)
#                 break

#         if assigned_category:
#             expense_data['category'] = assigned_category.id

#         # Pass request to the serializer context
#         serializer = ExpenseSerializer(data=expense_data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save()  # Save the expense to the database
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExpenseListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get expenses for the authenticated user
        expenses = Expense.objects.filter(user=request.user)
        serializer = ExpenseListSerializer(expenses, many=True)
        return Response(serializer.data)
    
class AddBudgetView(APIView):
    permission_classes = [IsAuthenticated]  # Require authentication

    def post(self, request):
        user = request.user
        amount = request.data.get("amount")
        month = request.data.get("month")

        if not amount or not month:
            return Response({"detail": "Amount and month are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if budget already exists for this month
        if Budget.objects.filter(user=user, month=month).exists():
            return Response({"detail": "Budget already exists for this month."}, status=status.HTTP_400_BAD_REQUEST)

        # Save new budget
        budget = Budget(user=user, amount=amount, month=month)
        budget.save()

        return Response({"message": "Budget set successfully", "amount": budget.amount, "month": budget.month}, status=status.HTTP_201_CREATED)


class ExpenseIncomePieChartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        total_income = Income.objects.filter(user=user).aggregate(total=Sum('amount'))['total'] or 0
        total_expense = Expense.objects.filter(user=user).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "total_income": total_income,
            "total_expense": total_expense
        })
    
class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        total_budget = Budget.objects.filter(user=user).aggregate(total=Sum('amount'))['total'] or 0
        total_income = Income.objects.filter(user=user).aggregate(total=Sum('amount'))['total'] or 0
        total_expense = Expense.objects.filter(user=user).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "total_budget": total_budget,
            "total_income": total_income,
            "total_expense": total_expense
        })


class RecentExpensesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        recent_expenses = Expense.objects.filter(user=user).order_by('-date')[:5]
        expenses_data = [
            {"amount": exp.amount, "description": exp.description, "date": exp.date}
            for exp in recent_expenses
        ]
        return Response(expenses_data)