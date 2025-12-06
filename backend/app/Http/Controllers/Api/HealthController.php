<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function index()
    {
        try {
            DB::connection()->getPdo();
            $dbStatus = 'connected';
        } catch (Exception $e) {
            $dbStatus = 'disconnected';
        }

        return response()->json([
            'status' => 'healthy',
            'service' => 'Laravel API',
            'version' => app()->version(),
            'timestamp' => now()->toDateTimeString(),
            'database' => $dbStatus,
            'endpoints' => [
                'products' => '/api/products',
                'health' => '/api/health'
            ]
        ]);
    }
}
