<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class BaseFilter
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Dynamically apply filters based on request parameters.
     */
    public function applyFilters(Builder $query): Builder
    {
        foreach ($this->request->all() as $param => $value) {
            if (method_exists($this, $param)) {
                $this->{$param}($query, $value);
            }
        }
        return $query;
    }

    /**
     * Get parameter value with default
     */
    protected function getParam(string $param, $default = null)
    {
        return $this->request->get($param, $default);
    }

    /**
     * Get multiple parameter values
     */
    protected function getArrayParam(string $param): array
    {
        $value = $this->request->get($param);
        return is_array($value) ? $value : [];
    }
} 