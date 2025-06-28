<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Requests\Api\StoreOrderRequest;
use App\Http\Requests\Api\IndexOrderRequest;
use App\Filters\OrderFilter;
use App\Models\Order;
use App\Models\Product;
use App\Events\OrderPlaced;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            $totalPrice = 0;
            $orderItems = [];

            // Validate product availability and calculate total
            foreach ($validated['products'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if (!$product->isInStock()) {
                    return response()->json([
                        'success' => false,
                        'message' => "Product {$product->name} is out of stock"
                    ], 400);
                }

                if (!$product->hasStock($item['quantity'])) {
                    return response()->json([
                        'success' => false,
                        'message' => "Insufficient stock for product {$product->name}. Available: {$product->quantity}"
                    ], 400);
                }

                $totalPrice += $product->price * $item['quantity'];
                $orderItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $product->price
                ];
            }

            $order = Order::create([
                'user_id' => auth()->id(),
                'total_price' => $totalPrice,
                'status' => 'pending',
                'shipping_address' => $validated['shipping_address'] ?? null,
                'billing_address' => $validated['billing_address'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItems as $item) {
                $order->products()->attach($item['product']->id, [
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);

                $item['product']->decrement('quantity', $item['quantity']);
            }

            DB::commit();

            event(new OrderPlaced($order));

            $order->load(['products', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'data' => new OrderResource($order)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to place order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Order $order): JsonResponse
    {
        if ($order->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $order->load(['products', 'user']);

        return response()->json([
            'success' => true,
            'data' => new OrderResource($order)
        ]);
    }

    public function index(IndexOrderRequest $request): JsonResponse
    {
        $query = Order::where('user_id', auth()->id())
                      ->with(['products', 'user']);
        
        $filter = new OrderFilter($request);
        $filter->applyFilters($query);
        
        $perPage = $request->get('per_page', 15);
        $orders = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders->items()),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
                'from' => $orders->firstItem(),
                'to' => $orders->lastItem(),
            ]
        ]);
    }
} 