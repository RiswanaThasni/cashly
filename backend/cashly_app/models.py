from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.timezone import now
from django.conf import settings

# Create your models here.


class CustomUser(AbstractUser):
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)  
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)      
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15,null=True, blank=True)
    USERNAME_FIELD = 'email'  
    REQUIRED_FIELDS = ['username', 'phone'] 

    def __str__(self):
        return self.email
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
    
class Expense(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="expenses")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """Automatically assign a category if not provided."""
        if not self.category and self.description:
            self.category = self.auto_assign_category()
        super().save(*args, **kwargs)

    def auto_assign_category(self):
        """Assigns a category based on description keywords."""
        category_mapping = {
            "food": ["burger", "pizza", "dinner", "lunch"],
            "transport": ["uber", "bus", "train", "taxi"],
            "entertainment": ["movie", "concert", "game"],
            "salary": ["salary", "paycheck", "income"],
            "groceries": ["walmart", "grocery", "supermarket"],
        }

        for category_name, keywords in category_mapping.items():
            if any(word in self.description.lower() for word in keywords):
                category, _ = Category.objects.get_or_create(name=category_name)
                return category
        return None

    def __str__(self):
        return f"{self.user.username} - {self.category.name if self.category else 'No Category'} - {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="budgets")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.CharField(max_length=7) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.month} Budget: {self.amount}"


class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - Read: {self.is_read}"
    

class Income(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="incomes")
    source = models.CharField(max_length=100)  
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    date = models.DateField(default=now)

    def __str__(self):
        return f"{self.user.username} - {self.source} - {self.amount}"
