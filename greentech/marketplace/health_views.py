"""
Vues pour le health check du serveur
"""

from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import time

@csrf_exempt
@require_http_methods(["GET", "HEAD"])
def health_check(request):
    """
    Endpoint de santé simple pour le keep-alive
    """
    return JsonResponse({
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'server': 'GreenTech Marketplace',
        'uptime': time.time(),
    })

@csrf_exempt
@require_http_methods(["GET"])
def ping(request):
    """
    Endpoint ping ultra-léger
    """
    return JsonResponse({'pong': True})
