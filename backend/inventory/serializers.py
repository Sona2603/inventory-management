from rest_framework import serializers
from .models import Product, StockHistory,Sale


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product

        exclude = ["user"]

class StockHistorySerializer(serializers.ModelSerializer):

    class Meta:

        model = StockHistory

        fields = "__all__"

class SaleSerializer(serializers.ModelSerializer):

    class Meta:

        model = Sale

        fields = "__all__"