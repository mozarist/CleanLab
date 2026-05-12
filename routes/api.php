<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', fn () => response()->json([
        'message' => 'Admin API access granted.',
    ]));

    Route::get('/transactions', fn () => response()->json([
        'message' => 'Admin transactions endpoint.',
    ]));

    Route::get('/services', fn () => response()->json([
        'message' => 'Admin services endpoint.',
    ]));

    Route::get('/customers', fn () => response()->json([
        'message' => 'Admin customers endpoint.',
    ]));
});

Route::middleware(['auth:sanctum', 'role:customer'])->prefix('customer')->group(function () {
    Route::get('/me', fn (Request $request) => $request->user());

    Route::get('/transactions', fn () => response()->json([
        'message' => 'Customer API access granted.',
    ]));
});
