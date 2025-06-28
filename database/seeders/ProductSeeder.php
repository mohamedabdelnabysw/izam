<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Electronics
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Latest iPhone with advanced camera system and A17 Pro chip',
                'price' => 999.99,
                'quantity' => 50,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/iphone15/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'MacBook Air M2',
                'description' => 'Ultra-thin laptop with M2 chip and all-day battery life',
                'price' => 1199.99,
                'quantity' => 30,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/macbook-air/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Premium noise-canceling wireless headphones',
                'price' => 399.99,
                'quantity' => 75,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/sony-headphones/200/300',
                'is_active' => true,
            ],
            
            // Clothing
            [
                'name' => 'Nike Air Max 270',
                'description' => 'Comfortable running shoes with Air Max technology',
                'price' => 150.00,
                'quantity' => 100,
                'category_id' => 2,
                'image_url' => 'https://picsum.photos/seed/nike-airmax/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'Levi\'s 501 Jeans',
                'description' => 'Classic straight-fit denim jeans',
                'price' => 89.99,
                'quantity' => 200,
                'category_id' => 2,
                'image_url' => 'https://picsum.photos/seed/levis-jeans/200/300',
                'is_active' => true,
            ],
            
            // Books
            [
                'name' => 'The Great Gatsby',
                'description' => 'F. Scott Fitzgerald\'s classic American novel',
                'price' => 12.99,
                'quantity' => 150,
                'category_id' => 3,
                'image_url' => 'https://picsum.photos/seed/gatsby/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'To Kill a Mockingbird',
                'description' => 'Harper Lee\'s Pulitzer Prize-winning novel',
                'price' => 14.99,
                'quantity' => 120,
                'category_id' => 3,
                'image_url' => 'https://picsum.photos/seed/mockingbird/200/300',
                'is_active' => true,
            ],
            
            // Home & Garden
            [
                'name' => 'Philips Hue Smart Bulb',
                'description' => 'WiFi-enabled smart LED bulb with 16 million colors',
                'price' => 49.99,
                'quantity' => 80,
                'category_id' => 4,
                'image_url' => 'https://picsum.photos/seed/philips-hue/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'Instant Pot Duo',
                'description' => '7-in-1 electric pressure cooker and slow cooker',
                'price' => 99.99,
                'quantity' => 60,
                'category_id' => 4,
                'image_url' => 'https://picsum.photos/seed/instant-pot/200/300',
                'is_active' => true,
            ],
            
            // Sports & Outdoors
            [
                'name' => 'Yeti Tundra 45 Cooler',
                'description' => 'Premium rotomolded cooler with superior ice retention',
                'price' => 299.99,
                'quantity' => 25,
                'category_id' => 5,
                'image_url' => 'https://picsum.photos/seed/yeti-cooler/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'Garmin Fenix 7',
                'description' => 'Premium multisport GPS watch with advanced features',
                'price' => 699.99,
                'quantity' => 40,
                'category_id' => 5,
                'image_url' => 'https://picsum.photos/seed/garmin-fenix/200/300',
                'is_active' => true,
            ],
            
            // New Products (will show "New" badge)
            [
                'name' => 'Apple Vision Pro',
                'description' => 'Revolutionary spatial computing device with advanced AR/VR capabilities',
                'price' => 3499.99,
                'quantity' => 15,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/vision-pro/200/300',
                'is_active' => true,
                'created_at' => now()->subDays(5), // Very recent
            ],
            [
                'name' => 'Tesla Model 3',
                'description' => 'Electric vehicle with autopilot and long range',
                'price' => 38990.00,
                'quantity' => 5,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/tesla-model3/200/300',
                'is_active' => true,
                'created_at' => now()->subDays(10), // Recent
            ],
            
            // Sale Products (will show "Sale" badge - under $50)
            [
                'name' => 'Wireless Earbuds',
                'description' => 'High-quality wireless earbuds with noise cancellation',
                'price' => 29.99,
                'quantity' => 150,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/wireless-earbuds/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Fitness tracking smartwatch with heart rate monitor',
                'price' => 39.99,
                'quantity' => 80,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/smart-watch/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'Bluetooth Speaker',
                'description' => 'Portable waterproof bluetooth speaker with 20-hour battery',
                'price' => 24.99,
                'quantity' => 200,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/bluetooth-speaker/200/300',
                'is_active' => true,
            ],
            
            // Popular Products (will show "Popular" badge - high quantity)
            [
                'name' => 'Amazon Echo Dot',
                'description' => 'Smart speaker with Alexa voice assistant',
                'price' => 49.99,
                'quantity' => 500,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/echo-dot/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'Kindle Paperwhite',
                'description' => 'Waterproof e-reader with adjustable backlight',
                'price' => 139.99,
                'quantity' => 300,
                'category_id' => 3,
                'image_url' => 'https://picsum.photos/seed/kindle-paperwhite/200/300',
                'is_active' => true,
            ],
            [
                'name' => 'AirPods Pro',
                'description' => 'Active noise cancellation wireless earbuds',
                'price' => 249.99,
                'quantity' => 400,
                'category_id' => 1,
                'image_url' => 'https://picsum.photos/seed/airpods-pro/200/300',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
} 