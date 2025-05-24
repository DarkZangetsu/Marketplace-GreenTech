from django.urls import re_path
from . import consumers

print("=== Loading WebSocket routing ===")

websocket_urlpatterns = [
    # Utiliser re_path avec une regex pour capturer l'user_id
    re_path(r'ws/messages/(?P<user_id>\w+)/$', consumers.MessageConsumer.as_asgi()),
]

print(f"WebSocket patterns chargés: {len(websocket_urlpatterns)} route(s)")
for pattern in websocket_urlpatterns:
    print(f"- Pattern: {pattern.pattern}")
    print(f"- Callback: {pattern.callback}")