<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('app');
});

// Catch-all route for React Router
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
