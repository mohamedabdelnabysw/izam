<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ProductFilter extends BaseFilter
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Get pagination per page value
     */
    public function getPerPage(): int
    {
        return $this->request->get('per_page', 15);
    }

    // Called dynamically if 'search' is present in request
    public function search(Builder $query, $value): void
    {
        if (!empty($value)) {
            $query->search($value);
        }
    }

    // Called dynamically if 'min_price' or 'max_price' are present
    public function min_price(Builder $query, $value): void
    {
        $max = $this->getParam('max_price');
        if ($value !== null && $max !== null) {
            $query->priceRange($value, $max);
        }
    }

    // No-op for max_price, handled in min_price
    public function max_price(Builder $query, $value): void
    {
        // Handled in min_price
    }

    // Called dynamically if 'category_id' is present
    public function category_id(Builder $query, $value): void
    {
        if (is_array($value) && !empty($value)) {
            $query->whereIn('category_id', $value);
        }
    }
} 