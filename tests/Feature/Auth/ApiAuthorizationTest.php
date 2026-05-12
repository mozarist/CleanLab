<?php

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

test('admin api routes require the admin role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Sanctum::actingAs($admin);

    $this->getJson('/api/admin/transactions')->assertOk();
    $this->getJson('/api/admin/customers')->assertOk();
});

test('customer api routes require the customer role', function () {
    $customer = User::factory()->create();
    $customer->assignRole('customer');

    Sanctum::actingAs($customer);

    $this->getJson('/api/customer/me')->assertOk();
    $this->getJson('/api/customer/transactions')->assertOk();
    $this->getJson('/api/admin/transactions')->assertForbidden();
});
