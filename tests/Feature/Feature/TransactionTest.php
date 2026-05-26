<?php

use App\Models\Customer;
use App\Models\Service;
use App\Models\Transactions;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

function transactionTestAdminUser(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

test('admin can view transactions index page', function () {
    $response = $this->actingAs(transactionTestAdminUser())->get(route('transactions.index'));
    $response->assertOk();
});

test('admin can see pagination metadata when transactions exceed one page', function () {
    $admin = transactionTestAdminUser();

    Transactions::factory()
        ->count(11)
        ->create([
            'admin_id' => $admin->id,
        ]);

    $response = $this->actingAs($admin)->get(route('transactions.index'));

    $response
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Transactions/Index')
            ->where('transactions.last_page', 2)
            ->has('transactions.data', 10)
        );
});

test('admin can create a transaction', function () {
    $admin = transactionTestAdminUser();
    $customer = Customer::factory()->create();
    $service = Service::factory()->create([
        'price' => 100000,
    ]);

    $response = $this->actingAs($admin)->post(route('transactions.store'), [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'quantity' => 2,
        'payment_method' => 'cash',
        'payment_status' => 'pending',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('transactions.index'));

    $this->assertDatabaseHas('transactions', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'quantity' => 2,
        'total_price' => 200000,
        'payment_method' => 'cash',
        'payment_status' => 'pending',
        'status' => 'antrian',
    ]);
});

test('admin can update a transaction', function () {
    $admin = transactionTestAdminUser();
    $customer = Customer::factory()->create();
    $service = Service::factory()->create([
        'price' => 100000,
    ]);
    $transaction = Transactions::factory()->create([
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'quantity' => 1,
        'total_price' => 100000,
        'status' => 'antrian',
        'payment_status' => 'pending',
        'admin_id' => $admin->id,
    ]);

    $response = $this->actingAs($admin)->put(route('transactions.update', $transaction), [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'quantity' => 3,
        'payment_method' => 'transfer',
        'payment_status' => 'paid',
        'status' => 'dicuci',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('transactions.index'));

    $transaction->refresh();
    expect($transaction->quantity)->toBe(3);
    expect($transaction->total_price)->toBe(300000);
    expect($transaction->status)->toBe('dicuci');
    expect($transaction->payment_status)->toBe('paid');
});

test('admin can delete a transaction', function () {
    $admin = transactionTestAdminUser();
    $transaction = Transactions::factory()->create([
        'admin_id' => $admin->id,
    ]);

    $response = $this->actingAs($admin)->delete(route('transactions.destroy', $transaction));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('transactions.index'));

    expect($transaction->fresh())->toBeNull();
});
