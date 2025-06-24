from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from django.conf import settings
from graphene_file_upload.django import FileUploadGraphQLView
from marketplace.health_views import health_check, ping

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(FileUploadGraphQLView.as_view(graphiql=True))),

    # Endpoints de santé pour keep-alive
    path('api/health/', health_check, name='health_check'),
    path('api/ping/', ping, name='ping'),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
