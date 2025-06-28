# E-commerce API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
This API uses Laravel Sanctum for authentication. To access protected endpoints, you need to:

1. Register/Login to get a token
2. Include the token in the Authorization header: `Bearer {token}`

## Endpoints

### Categories

#### GET /categories
Get all categories with product counts.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "Electronics",
            "products_count": 3
        }
    ]
}
```

#### GET /categories/{id}
Get a specific category with its products.

### Products

#### GET /products
Get all active products with pagination and filtering.

**Query Parameters:**
- `search` (optional): Search by product name or description
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `category_id[]` (optional): Filter by one or more categories (array of category IDs)
- `per_page` (optional): Items per page (default: 15)

**Examples:**
```
# Single category filter
GET /api/products?category_id[]=1

# Multiple categories filter
GET /api/products?category_id[]=1&category_id[]=2

# Combined filters
GET /api/products?search=iphone&min_price=500&max_price=1000&category_id[]=1&per_page=10
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "iPhone 15 Pro",
            "description": "Latest iPhone with advanced camera system",
            "price": 999.99,
            "quantity": 50,
            "image_url": "https://example.com/iphone15.jpg",
            "is_active": true,
            "category": {
                "id": 1,
                "name": "Electronics"
            },
            "created_at": "2024-01-01T00:00:00.000000Z",
            "updated_at": "2024-01-01T00:00:00.000000Z"
        }
    ],
    "pagination": {
        "current_page": 1,
        "last_page": 5,
        "per_page": 15,
        "total": 75,
        "from": 1,
        "to": 15
    }
}
```

#### GET /products/{id}
Get a specific product.

### Orders (Protected - Requires Authentication)

#### POST /orders
Place a new order.

**Request Body:**
```json
{
    "products": [
        {
            "product_id": 1,
            "quantity": 2
        },
        {
            "product_id": 3,
            "quantity": 1
        }
    ],
    "shipping_address": "123 Main St, City, State 12345",
    "billing_address": "123 Main St, City, State 12345",
    "notes": "Please deliver after 6 PM"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Order placed successfully",
    "data": {
        "id": 1,
        "total_price": 2399.97,
        "status": "pending",
        "shipping_address": "123 Main St, City, State 12345",
        "billing_address": "123 Main St, City, State 12345",
        "notes": "Please deliver after 6 PM",
        "user": {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        },
        "products": [
            {
                "id": 1,
                "name": "iPhone 15 Pro",
                "price": 999.99,
                "quantity": 2,
                "subtotal": 1999.98
            },
            {
                "id": 3,
                "name": "Sony WH-1000XM5",
                "price": 399.99,
                "quantity": 1,
                "subtotal": 399.99
            }
        ],
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
    }
}
```

#### GET /orders
Get all orders for the authenticated user.

**Query Parameters:**
- `per_page` (optional): Items per page (default: 15)
- `status` (optional): Filter by order status (pending, processing, shipped, delivered, cancelled)
- `sort_by` (optional): Sort by field (created_at, total_price, status) - default: created_at
- `sort_direction` (optional): Sort direction (asc, desc) - default: desc

#### GET /orders/{id}
Get a specific order (only if it belongs to the authenticated user).

## Validation Rules

### Product Filtering
- `search`: Maximum 100 characters
- `min_price`: Must be numeric and non-negative
- `max_price`: Must be numeric, non-negative, and >= min_price
- `category_id[]`: Array of valid category IDs (at least one required if provided)
- `per_page`: Integer between 1-100

### Order Creation
- `products`: Required array with at least one product
- `products.*.product_id`: Required, must exist in products table
- `products.*.quantity`: Required integer between 1-100
- `shipping_address`: Optional, maximum 500 characters
- `billing_address`: Optional, maximum 500 characters
- `notes`: Optional, maximum 1000 characters

## Error Responses

### Validation Error (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "products": ["The products field is required."],
        "category_id": ["Category ID must be an array."],
        "category_id.0": ["Each category ID must be a number."],
        "category_id": ["At least one category ID is required."]
    }
}
```

### Stock Error (400)
```json
{
    "success": false,
    "message": "Product iPhone 15 Pro is out of stock"
}
```

### Unauthorized (403)
```json
{
    "success": false,
    "message": "Unauthorized"
}
```

## Features

- **Caching**: Product listings are cached for 5 minutes
- **Pagination**: All list endpoints support pagination
- **Search**: Products can be searched by name or description
- **Filtering**: Products can be filtered by price range and multiple categories
- **Stock Management**: Automatic stock validation and updates
- **Events**: Order placement triggers events for notifications
- **Authentication**: Protected endpoints using Laravel Sanctum
- **Validation**: Comprehensive input validation using Form Requests
- **Error Handling**: Proper error responses with meaningful messages
- **Form Requests**: Clean separation of validation logic from controllers
- **Filter Classes**: Clean, maintainable filtering logic

## Setup Instructions

1. Run migrations:
```bash
php artisan migrate
```

2. Seed the database:
```bash
php artisan db:seed
```

3. Start the server:
```bash
php artisan serve
```

4. For authentication, use Laravel's built-in authentication routes or create custom ones as needed. 