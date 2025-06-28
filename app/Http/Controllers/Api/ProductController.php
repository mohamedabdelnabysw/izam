<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Requests\Api\IndexProductRequest;
use App\Filters\ProductFilter;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(IndexProductRequest $request): JsonResponse
    {
        $query = Product::with('category')->active();
        
        $filter = new ProductFilter($request);
        $filter->applyFilters($query);
        
        $perPage = $request->get('per_page', 15);
        $cacheKey = 'products_' . md5($request->fullUrl());
        
        $products = Cache::remember($cacheKey, 300, function () use ($query, $perPage) {
            return $query->paginate($perPage);
        });

        return response()->json([
            'success' => true,
            'data' => ProductResource::collection($products->items()),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load('category');
        
        return response()->json([
            'success' => true,
            'data' => new ProductResource($product)
        ]);
    }
} 