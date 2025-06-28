<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class IndexProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:100',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0|gte:min_price',
            'category_id' => 'nullable|array|min:1',
            'category_id.*' => 'integer|exists:categories,id',
            'per_page' => 'nullable|integer|min:1|max:100',
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
            'search.max' => 'Search term cannot exceed 100 characters.',
            'min_price.numeric' => 'Minimum price must be a number.',
            'min_price.min' => 'Minimum price cannot be negative.',
            'max_price.numeric' => 'Maximum price must be a number.',
            'max_price.min' => 'Maximum price cannot be negative.',
            'max_price.gte' => 'Maximum price must be greater than or equal to minimum price.',
            'category_id.array' => 'Category ID must be an array.',
            'category_id.min' => 'At least one category ID is required.',
            'category_id.*.integer' => 'Each category ID must be a number.',
            'category_id.*.exists' => 'One or more selected categories do not exist.',
            'per_page.integer' => 'Per page must be a number.',
            'per_page.min' => 'Per page must be at least 1.',
            'per_page.max' => 'Per page cannot exceed 100.',
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param  \Illuminate\Validation\Validator  $validator
     * @return void
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('min_price') && $this->has('max_price')) {
                if ($this->min_price > $this->max_price) {
                    $validator->errors()->add('max_price', 'Maximum price must be greater than minimum price.');
                }
            }
        });
    }
} 