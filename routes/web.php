<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Customers
    Route::resource('customers', CustomerController::class)->only(['index', 'store', 'update', 'destroy']);

    // Services
    Route::resource('services', ServiceController::class)->only(['index', 'store', 'update', 'destroy']);

    // Transactions
    Route::resource('transactions', TransactionController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
