<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class OrderFilter extends BaseFilter
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

    /**
     * Get validated filter parameters
     */
    public function getValidatedParams(): array
    {
        return [
            'per_page' => $this->getPerPage(),
            'status' => $this->getParam('status'),
            'sort_by' => $this->getParam('sort_by', 'created_at'),
            'sort_direction' => $this->getParam('sort_direction', 'desc'),
        ];
    }

    // Called dynamically if 'status' is present in request
    public function status(Builder $query, $value): void
    {
        if (!empty($value)) {
            $query->where('status', $value);
        }
    }

    // Called dynamically if 'sort_by' or 'sort_direction' are present
    public function sort_by(Builder $query, $value): void
    {
        $direction = $this->getParam('sort_direction', 'desc');
        $allowedSortFields = ['created_at', 'total_price', 'status'];
        if (in_array($value, $allowedSortFields)) {
            $query->orderBy($value, $direction);
        } else {
            $query->orderBy('created_at', $direction);
        }
    }

    // No-op for sort_direction, handled in sort_by
    public function sort_direction(Builder $query, $value): void
    {
        // Handled in sort_by
    }
} 