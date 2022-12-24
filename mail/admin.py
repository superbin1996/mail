from django.contrib import admin
from mail.views import register

from .models import User, Email

class EmailAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "sender", "subject", "body", "timestamp", "read", "archived")

class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email")

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Email, EmailAdmin)