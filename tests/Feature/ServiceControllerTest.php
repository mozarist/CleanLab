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

function serviceTestAdminUser(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

test('admin can view service totals on the services index page', function () {
    $admin = serviceTestAdminUser();
    $service = Service::factory()->create([
        'price' => 100000,
        'service_name' => 'Wash and Fold',
    ]);
    $customer = Customer::factory()->create();

    Transactions::create([
        'invoice_code' => 'INV-20260526-AAAAAA',
        'admin_id' => $admin->id,
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'quantity' => 2,
        'total_price' => 200000,
        'status' => 'antrian',
        'payment_method' => 'cash',
        'payment_status' => 'paid',
    ]);

    Transactions::create([
        'invoice_code' => 'INV-20260526-BBBBBB',
        'admin_id' => $admin->id,
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'quantity' => 1,
        'total_price' => 100000,
        'status' => 'antrian',
        'payment_method' => 'cash',
        'payment_status' => 'paid',
    ]);

    $response = $this->actingAs($admin)->get(route('services.index'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Services/Index')
            ->where('services.data.0.service_name', 'Wash and Fold')
            ->where('services.data.0.total_orders', 2)
            ->where('services.data.0.total_revenue', 300000)
        );
});

test('admin can see pagination metadata on the services index page', function () {
    $admin = serviceTestAdminUser();

    Service::factory()->count(11)->create();

    $response = $this->actingAs($admin)->get(route('services.index'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Services/Index')
            ->where('services.last_page', 2)
            ->has('services.links')
        );
});
