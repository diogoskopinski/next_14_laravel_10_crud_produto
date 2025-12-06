<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ProductController;

// Health check
Route::get('/health', [HealthController::class, 'index']);

// Products CRUD
Route::apiResource('products', ProductController::class);

// AI Integration
Route::post('/generate-description', [ProductController::class, 'generateDescription']);

// API info
Route::get('/', function () {
    return response()->json([
        'app' => config('app.name'),
        'version' => '1.0.0',
        'endpoints' => [
            'GET /api/health',
            'GET /api/products',
            'POST /api/products',
            'GET /api/products/{id}',
            'PUT /api/products/{id}',
            'DELETE /api/products/{id}',
            'POST /api/generate-description'
        ]
    ]);
});
