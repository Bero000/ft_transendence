import os
import requests
from django.shortcuts import redirect, render, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from .models import CustomUser 
from django.contrib.auth import login, logout
from django.db import transaction
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.translation import gettext as _
from django.urls import reverse
from .Producer import send_kafka_message
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
import json

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class SaveMatchResultView(View):
    def post(self, request, *args, **kwargs):
        try:
            # Gelen veriyi JSON olarak yükle
            data = json.loads(request.body)

            # JSON'dan "winner" bilgisini al
            winner_username = data.get("winner")
            if not winner_username:
                return JsonResponse({"success": False, "error": "Winner bilgisi eksik."}, status=400)

            # Sisteme giriş yapmış kullanıcı
            current_user = request.user

            # Sisteme giriş yapmış kullanıcının username'i ile winner eşleşmesini kontrol et
            if current_user.username == winner_username:
                current_user.score += 50  # Puanı 50 artır
            else:
                current_user.score -= 50  # Puanı 50 azalt
            
            # Güncellemeyi kaydet
            current_user.save()

            return JsonResponse({"success": True, "message": "Maç sonucu başarıyla kaydedildi.", "new_score": current_user.score})
        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Geçersiz JSON formatı."}, status=400)
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)


def load_page(request, page=None):
    if page is None:
        page = request.GET.get('page', 'base')  # Default to 'base' page

    print(f"Loading: {page}")  # Check which page is being loaded
    valid_pages = ['base', 'profile', 'login_with_42', 'pingpong', 'g_conti', 'game-single', 'game-multi', 'settings']
    if page not in valid_pages:
        page = 'base'  # Redirect to 'base' page if invalid page
    return render(request, f'{page}.html')

def load_navbar(request):
    return render(request, 'navbar.html', {})

def profile(request):
    if request.user.is_authenticated:
        # Show user info if logged in
        user_info = request.user
    else:
        # If user not logged in, handle accordingly
        user_info = None

    return render(request, 'profile.html', {'user_info': user_info})

def login_with_42(request):
    authorization_url = (
        f"{settings.AUTHORIZATION_URL}"
        f"?client_id={settings.CLIENT_ID}"
        f"&redirect_uri={settings.REDIRECT_URI}"
        f"&response_type=code"
        f"&scope=public"
    )
    return redirect(authorization_url)

def callback_42(request):
    code = request.GET.get('code')
    if code:
        token_response = requests.post(settings.TOKEN_URL, data={
            'grant_type': 'authorization_code',
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.REDIRECT_URI,
        }).json()


        access_token = token_response.get("access_token")
        if access_token:
            user_info = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()

            if 'login' in user_info and 'email' in user_info:
                username = user_info.get('login')
                email = user_info.get('email')

                # Get first and last name
                first_name = user_info.get('first_name', 'DefaultFirstName')  # Default value
                last_name = user_info.get('last_name', 'DefaultLastName')  # Default value

                user, created = CustomUser.objects.get_or_create(
                    username=username,
                    defaults={'email': email, 'first_name': first_name, 'last_name': last_name}
                )

                if created:
                    # New user created
                    user.email = email
                    user.first_name = first_name
                    user.last_name = last_name
                else:
                    # Update existing user
                    user.email = email
                    user.first_name = first_name
                    user.last_name = last_name

                user.access_token = access_token
                user.refresh_token = token_response.get("refresh_token")
                user.expires_in = token_response.get("expires_in")
                user.save()

                # Login process
                login(request, user)

                refresh = RefreshToken.for_user(user)

                send_kafka_message("user-login-events", {"email": email, "ip_address": request.META.get('REMOTE_ADDR')})
                return redirect('home')

from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def logout_view(request):
    logout(request)  # Kullanıcıyı çıkış yap
    return redirect('home')       
def ping_pong(request):
    return render(request, 'g_conti.html')

def home(request):
    return render(request, 'base.html')

def base(request):
    return render(request, 'base.html')