from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    # Mevcut alanlar
    image_url = models.URLField(blank=True, null=True) 
    access_token = models.CharField(max_length=255, blank=True, null=True) # Erişim token'ı 
    refresh_token = models.CharField(max_length=255, blank=True, null=True) # Yenileme token'ı
    expires_in = models.IntegerField(null=True, blank=True) # Token'ın geçerlilik süresi
    created_at = models.DateTimeField(auto_now_add=True) # Kullanıcının oluşturulma tarihi
    secret_valid_until = models.DateTimeField(null=True, blank=True) # Kullanıcının şifresinin geçerlilik süresi
    image = models.URLField(max_length=500, blank=True, null=True)

    # Yeni alan: Puan
    score = models.IntegerField(default=0) # Kullanıcının puanı

    def __str__(self):
        return self.username
