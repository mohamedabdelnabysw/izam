<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendOrderNotification
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPlaced $event): void
    {
        $order = $event->order;
        
        // Log the order placement for admin notification
        Log::info('New order placed', [
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'total_price' => $order->total_price,
            'status' => $order->status,
            'created_at' => $order->created_at
        ]);

        // In a real application, you would send an email here
        // Mail::to('admin@example.com')->send(new OrderNotification($order));
        
        // For now, we'll just log that the email would be sent
        Log::info('Order notification email would be sent to admin', [
            'order_id' => $order->id
        ]);
    }
} 