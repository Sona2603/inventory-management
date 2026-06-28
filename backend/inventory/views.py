from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework import generics, filters

from django.shortcuts import get_object_or_404

from .models import Product, StockHistory,Sale
from .serializers import ProductSerializer,StockHistorySerializer,SaleSerializer



class ProductListCreateView(generics.ListCreateAPIView):

    serializer_class = ProductSerializer

    permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter]

    search_fields = ["name", "category"]

    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):

        return Product.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):

        product = serializer.save(
            user=self.request.user
        )

        StockHistory.objects.create(
            product_name=product.name,
            quantity=product.quantity,
            action="CREATED",
            user=self.request.user
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):

    product = get_object_or_404(
        Product,
        id=pk,
        user=request.user
    )

    StockHistory.objects.create(
        product_name=product.name,
        quantity=product.quantity,
        action="DELETED",
        user=request.user
    )

    product.delete()

    return Response({
        "message": "Product deleted successfully"
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_product(request, pk):

    product = get_object_or_404(
        Product,
        id=pk,
        user=request.user
    )

    old_quantity = product.quantity

    serializer = ProductSerializer(
        product,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():

        updated_product = serializer.save(
            user=request.user
        )

        action = "UPDATED"

        if updated_product.quantity < old_quantity:
            action = "SOLD"

        StockHistory.objects.create(
            product_name=updated_product.name,
            quantity=updated_product.quantity,
            action=action,
            user=request.user
        )

        return Response(
            ProductSerializer(updated_product).data
        )

    return Response(serializer.errors)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_history(request):

    history = StockHistory.objects.filter(
        user=request.user
    ).order_by("-created_at")

    serializer = StockHistorySerializer(
        history,
        many=True
    )

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell_product(request, pk):

    product = get_object_or_404(
        Product,
        id=pk,
        user=request.user
    )

    quantity = int(
        request.data.get("quantity")
    )

    if quantity > product.quantity:

        return Response({
            "error": "Not enough stock"
        })

    product.quantity -= quantity

    product.save()

    total = quantity * product.price

    sale = Sale.objects.create(
        product=product,
        quantity_sold=quantity,
        selling_price=product.price,
        total_price=total,
        user=request.user
    )

    StockHistory.objects.create(
        product_name=product.name,
        quantity=product.quantity,
        action="SOLD",
        user=request.user
    )

    return Response(
        SaleSerializer(sale).data
    )