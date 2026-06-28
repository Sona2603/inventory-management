from rest_framework.routers import DefaultRouter
from .views import ProductListCreateView, delete_product,update_product,stock_history,sell_product
from django.urls import path,include

router = DefaultRouter()



urlpatterns = [
    path("products/",ProductListCreateView.as_view()),
    path('products/delete/<int:pk>/', delete_product),
    path('products/update/<int:pk>/',update_product),
    path("stock-history/",stock_history),
    path("products/sell/<int:pk>/",sell_product),
]