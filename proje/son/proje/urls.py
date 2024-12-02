from django.shortcuts import redirect
from django.urls import path, include
from django.contrib import admin
from backend import views


urlpatterns = [
    path('', views.load_page, name='home'),  # Ana sayfa
    path("pingpong/save-result/", views.SaveMatchResultView.as_view(), name="save_match_result"),
    path('load_page/', views.load_page, name='load_page'),  # Dinamik sayfa yükleme
    path('pingpong', views.load_page, {'page': 'pingpong'}, name='pingpong'),
    path('profile', views.load_page, {'page': 'profile'}, name='profile'),
    path('login_with_42', views.load_page, {'page': 'login_with_42'}, name='login_with_42'),
    path('logout', views.logout_view, name='logout'),
    path('base', views.load_page, {'page': 'base'}, name='base'),
    path('g_conti', views.load_page, {'page': 'g_conti'}, name='g_conti'),
    path('game-single', views.load_page, {'page': 'game-single'}, name='game-single'),
    path('game-multi', views.load_page, {'page': 'game-multi'}, name='game-multi'),
    path('settings', views.load_page, {'page': 'settings'}, name='settings'),
    path('profile', views.profile, name='profile'),
    path('admin/', admin.site.urls),
    path('load_navbar/', views.load_navbar, name='load_navbar'),
    path('login_with_42/', views.login_with_42, name='login_with_42'),
    path('callback_42/', views.callback_42, name='callback_42'),
    path('index', views.callback_42, name='callback_42'),
]
    