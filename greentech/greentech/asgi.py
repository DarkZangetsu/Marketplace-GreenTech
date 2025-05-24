import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greentech.settings')

# Initialiser Django AVANT d'importer
django_asgi_app = get_asgi_application()

# Importer APRÈS
from marketplace.routing import websocket_urlpatterns

print("=== CONFIGURATION ASGI DEBUG ===")
print(f"Nombre de patterns WebSocket: {len(websocket_urlpatterns)}")
for i, pattern in enumerate(websocket_urlpatterns):
    print(f"Pattern {i+1}: {pattern.pattern}")
    print(f"Callback {i+1}: {pattern.callback}")

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})

print("Application ASGI configurée")