# Filter Classes Implementation

## Overview

This project uses filter classes to handle query filtering logic in a clean, maintainable way. Instead of having multiple if statements in controllers, we use dedicated filter classes that encapsulate all filtering logic.

## Architecture

### BaseFilter Class
The `BaseFilter` class provides common functionality that all filters can extend:

```php
abstract class BaseFilter
{
    protected $request;
    
    abstract public function apply(Builder $query): Builder;
    
    public function getPerPage(): int
    protected function hasParam(string $param): bool
    protected function getParam(string $param, $default = null)
    protected function getArrayParam(string $param): array
}
```

### ProductFilter Class
Handles all product-related filtering:

```php
class ProductFilter extends BaseFilter
{
    public function apply(Builder $query): Builder
    {
        $this->applySearchFilter($query);
        $this->applyPriceRangeFilter($query);
        $this->applyCategoryFilter($query);
        return $query;
    }
}
```

**Supported Filters:**
- **Search**: Filter by product name or description
- **Price Range**: Filter by minimum and maximum price
- **Category**: Filter by array of category IDs (multiple categories only)
- **Pagination**: Control items per page

### OrderFilter Class
Handles all order-related filtering and sorting:

```php
class OrderFilter extends BaseFilter
{
    public function apply(Builder $query): Builder
    {
        $this->applyStatusFilter($query);
        $this->applySorting($query);
        return $query;
    }
}
```

**Supported Filters:**
- **Status**: Filter by order status
- **Sorting**: Sort by created_at, total_price, or status
- **Pagination**: Control items per page

## Usage in Controllers

### Before (Multiple if statements):
```php
public function index(Request $request): JsonResponse
{
    $query = Product::with('category')->active();
    
    if ($request->has('search')) {
        $query->search($request->search);
    }
    
    if ($request->has('min_price') && $request->has('max_price')) {
        $query->priceRange($request->min_price, $request->max_price);
    }
    
    if ($request->has('category_id')) {
        $query->whereIn('category_id', $request->category_id);
    }
    
    $products = $query->paginate($request->get('per_page', 15));
    // ... rest of the code
}
```

### After (Using Filter Class):
```php
public function index(IndexProductRequest $request): JsonResponse
{
    $query = Product::with('category')->active();
    
    // Apply filters using the filter class
    $filter = new ProductFilter($request);
    $filter->apply($query);
    
    // Get pagination from filter and handle caching in controller
    $perPage = $filter->getPerPage();
    $cacheKey = 'products_' . md5($request->fullUrl());
    
    $products = Cache::remember($cacheKey, 300, function () use ($query, $perPage) {
        return $query->paginate($perPage);
    });
    
    // ... rest of the code
}
```

## Benefits

### 1. **Clean Controllers**
- Controllers are now focused on their primary responsibility
- No more multiple if statements cluttering the code
- Easier to read and understand

### 2. **Reusability**
- Filter logic can be reused across different controllers
- Easy to extend with new filter types
- Consistent filtering behavior

### 3. **Maintainability**
- Filter logic is centralized in dedicated classes
- Easy to modify or add new filters
- Better separation of concerns

### 4. **Testability**
- Filter classes can be unit tested independently
- Easier to mock and test different filter scenarios
- Better code coverage

### 5. **Extensibility**
- Easy to add new filter types by extending BaseFilter
- Consistent interface across all filters
- Simple to implement new filtering logic

### 6. **Single Responsibility**
- Filter classes focus only on filtering logic
- Caching is handled at the controller level
- Clear separation of concerns

## API Examples

### Product Filtering
```bash
# Single category filter (array with one element)
GET /api/products?category_id[]=1

# Multiple categories filter
GET /api/products?category_id[]=1&category_id[]=2

# Search + Category + Price Range
GET /api/products?search=iphone&category_id[]=1&min_price=500&max_price=1000

# Pagination
GET /api/products?per_page=5
```

### Order Filtering
```bash
# Status Filter + Sorting
GET /api/orders?status=pending&sort_by=total_price&sort_direction=desc

# Pagination
GET /api/orders?per_page=10
```

## Adding New Filters

To add a new filter, simply:

1. **Extend BaseFilter**:
```php
class NewFilter extends BaseFilter
{
    public function apply(Builder $query): Builder
    {
        $this->applyCustomFilter($query);
        return $query;
    }
    
    protected function applyCustomFilter(Builder $query): void
    {
        if ($this->hasParam('custom_param')) {
            $value = $this->getParam('custom_param');
            $query->where('custom_field', $value);
        }
    }
}
```

2. **Use in Controller**:
```php
$filter = new NewFilter($request);
$filter->apply($query);
```

## Best Practices

1. **Always extend BaseFilter** for consistency
2. **Use helper methods** like `hasParam()` and `getParam()`
3. **Keep filters focused** on a single responsibility (filtering only)
4. **Handle caching in controllers**, not in filter classes
5. **Validate parameters** in the filter class when needed
6. **Use descriptive method names** for filter methods
7. **Document complex filtering logic** with comments
8. **Use arrays for multiple values** (like category_id[])

## Testing

Filter classes can be easily tested:

```php
public function test_product_filter_applies_search()
{
    $request = new Request(['search' => 'iphone']);
    $filter = new ProductFilter($request);
    $query = Product::query();
    
    $filter->apply($query);
    
    // Assert the query was modified correctly
    $this->assertStringContainsString('search', $query->toSql());
}

public function test_product_filter_applies_category_array()
{
    $request = new Request(['category_id' => [1, 2]]);
    $filter = new ProductFilter($request);
    $query = Product::query();
    
    $filter->apply($query);
    
    // Assert the query was modified correctly
    $this->assertStringContainsString('whereIn', $query->toSql());
}
```

This filter class implementation provides a clean, maintainable, and extensible solution for handling complex query filtering in Laravel applications while maintaining clear separation of concerns. 