from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, LogoutView, AddExpenseView, ExpenseListView, AddBudgetView, ExpenseIncomePieChartView, DashboardSummaryView, RecentExpensesView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),

    path('auth/login/', LoginView.as_view(),name='login'),

    path('auth/profile/', UserProfileView.as_view(), name='profile'),

    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('auth/logout/', LogoutView.as_view(), name='logout'),

    path('auth/expenses/add/', AddExpenseView.as_view(), name='add_expense'),

    path('auth/expenses/view/', ExpenseListView.as_view(), name='expense-list'),

    path('auth/budget/add/', AddBudgetView.as_view(), name='add_budget'),

    path('auth/expense-summary/', ExpenseIncomePieChartView.as_view(), name='expense-summary'),

    path('auth/dashboard-summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    
    path('auth/recent-exprnses/', RecentExpensesView.as_view(), name='recent-expenses'),


]