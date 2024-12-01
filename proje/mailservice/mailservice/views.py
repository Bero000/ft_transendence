import json
import logging
import os

from django.core.mail import send_mail
from django.http import JsonResponse

logger = logging.getLogger(__name__)

def send_email(email, ip_address):
    subject = "Ahmet off a bas gardasım oohh off a bass"
    message = "İntra ile giriş yapıldı giriş yapılan IP Adresi: " + ip_address
    from_email = os.getenv("EMAIL_HOST_USER")
    try:
        send_mail(subject, message, from_email, [email])
        logger.fatal(f"Email sent to {email} with subject '{subject}'")
    except Exception as e:
        logger.fatal(f"Failed to send email to {email}: {str(e)}")
