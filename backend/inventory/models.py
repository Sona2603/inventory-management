from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):

    name = models.CharField(max_length=200)

    quantity = models.IntegerField()

    category = models.CharField(max_length=100)

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    description = models.TextField(
        blank=True,
        null=True
    )

    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True
    )

    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name

class StockHistory(models.Model):

    ACTIONS = (
        ("CREATED", "CREATED"),
        ("UPDATED", "UPDATED"),
        ("DELETED", "DELETED"),
    )

    product_name = models.CharField(max_length=255)

    quantity = models.IntegerField(default=0)

    action = models.CharField(
        max_length=20,
        choices=ACTIONS
    )

    created_at = models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.product_name} - {self.action}"

class Sale(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity_sold = models.IntegerField()

    selling_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    sold_at = models.DateTimeField(
        auto_now_add=True
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    def __str__(self):

        return f"{self.product.name} sold"