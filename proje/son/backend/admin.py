from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Kullanıcı listesi görünümü için alanlar
    list_display = (
        'username', 'email', 'first_name', 'last_name', 'is_staff', 'score'
    )
    # Arama yapılabilecek alanlar
    search_fields = ('username', 'email', 'first_name', 'last_name')
    # Detay sayfasında düzenlenebilir alanlar
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('score',  'access_token', 'refresh_token', 'expires_in', 'secret_valid_until')}),
    )
    # Kullanıcı oluşturma formunda görünecek ek alanlar
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('score',)}),
    )

# Admin paneline kaydet
admin.site.register(CustomUser, CustomUserAdmin)
