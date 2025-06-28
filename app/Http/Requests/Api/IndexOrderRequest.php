<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class IndexOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'per_page' => 'nullable|integer|min:1|max:100',
            'status' => 'nullable|string|in:pending,processing,shipped,delivered,cancelled',
            'sort_by' => 'nullable|string|in:created_at,total_price,status',
            'sort_direction' => 'nullable|string|in:asc,desc',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'per_page.integer' => 'Per page must be a number.',
            'per_page.min' => 'Per page must be at least 1.',
            'per_page.max' => 'Per page cannot exceed 100.',
            'status.in' => 'Status must be one of: pending, processing, shipped, delivered, cancelled.',
            'sort_by.in' => 'Sort by must be one of: created_at, total_price, status.',
            'sort_direction.in' => 'Sort direction must be either asc or desc.',
        ];
    }

    /**
     * Get the validated data from the request.
     *
     * @param array|int|string|null $key
     * @param mixed $default
     * @return mixed
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // Set default values
        if (!isset($validated['per_page'])) {
            $validated['per_page'] = 15;
        }
        if (!isset($validated['sort_by'])) {
            $validated['sort_by'] = 'created_at';
        }
        if (!isset($validated['sort_direction'])) {
            $validated['sort_direction'] = 'desc';
        }

        return $validated;
    }
} 