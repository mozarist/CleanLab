<?php

use App\Models\Customer;
use App\Models\Service;
use App\Models\Transactions;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('admins can visit the dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');
    $this->actingAs($user);

    $transactions = [
        ['invoice_code' => 'INV-001', 'status' => 'antrian', 'payment_status' => 'paid', 'total_price' => 150000, 'created_at' => now()->subMinutes(6)],
        ['invoice_code' => 'INV-002', 'status' => 'siap_diambil', 'payment_status' => 'pending', 'total_price' => 175000, 'created_at' => now()->subMinutes(5)],
        ['invoice_code' => 'INV-003', 'status' => 'dicuci', 'payment_status' => 'paid', 'total_price' => 200000, 'created_at' => now()->subMinutes(4)],
        ['invoice_code' => 'INV-004', 'status' => 'siap_diambil', 'payment_status' => 'paid', 'total_price' => 250000, 'created_at' => now()->subMinutes(3)],
        ['invoice_code' => 'INV-005', 'status' => 'disetrika', 'payment_status' => 'pending', 'total_price' => 125000, 'created_at' => now()->subMinutes(2)],
        ['invoice_code' => 'INV-006', 'status' => 'diambil', 'payment_status' => 'paid', 'total_price' => 300000, 'created_at' => now()->subMinutes(1)],
    ];

    foreach ($transactions as $transactionData) {
        $customer = Customer::factory()->create();
        $service = Service::factory()->create();

        Transactions::factory()->create([
            'admin_id' => $user->id,
            'customer_id' => $customer->id,
            'service_id' => $service->id,
            'invoice_code' => $transactionData['invoice_code'],
            'status' => $transactionData['status'],
            'payment_status' => $transactionData['payment_status'],
            'total_price' => $transactionData['total_price'],
            'created_at' => $transactionData['created_at'],
            'updated_at' => $transactionData['created_at'],
        ]);
    }

    $response = $this->get(route('dashboard'));
    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('summary.totalTransactions', 6)
            ->where('summary.totalRevenue', 900000)
            ->where('summary.pendingPayments', 2)
            ->where('summary.readyToSendLaundry', 2)
            ->has('recentTransactions', 5)
            ->has('readyToSendLaundryTransactions', 2)
            ->where('recentTransactions.0.invoice_code', 'INV-006')
            ->where('recentTransactions.4.invoice_code', 'INV-002')
            ->where('readyToSendLaundryTransactions.0.invoice_code', 'INV-004')
        );
});

test('customers cannot visit the dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertForbidden();
});
