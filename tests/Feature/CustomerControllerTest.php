<?php

use App\Models\Customer;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

function customerTestAdminUser(): User
{
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    return $admin;
}

test('admin can create a customer account with customer role', function () {
    $response = $this->actingAs(customerTestAdminUser())->post(route('customers.store'), [
        'name' => 'Customer User',
        'email' => 'customer@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'phone' => '081234567890',
        'address' => '123 Customer Street',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    $user = User::where('email', 'customer@example.com')->firstOrFail();

    expect($user->name)->toBe('Customer User');
    expect($user->hasRole('customer'))->toBeTrue();

    $this->assertDatabaseHas('customers', [
        'user_id' => $user->id,
        'phone' => '081234567890',
        'address' => '123 Customer Street',
    ]);
});

test('admin can update the linked customer user and profile data', function () {
    $user = User::factory()->create([
        'name' => 'Original Name',
        'email' => 'original@example.com',
    ]);
    $user->assignRole('customer');

    $customer = Customer::create([
        'user_id' => $user->id,
        'phone' => '0800000000',
        'address' => 'Old Address',
    ]);

    $response = $this->actingAs(customerTestAdminUser())->put(route('customers.update', $customer), [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'password' => '',
        'password_confirmation' => '',
        'phone' => '0811111111',
        'address' => 'New Address',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    $user->refresh();
    $customer->refresh();

    expect($user->name)->toBe('Updated Name');
    expect($user->email)->toBe('updated@example.com');
    expect($customer->phone)->toBe('0811111111');
    expect($customer->address)->toBe('New Address');
});

test('admin can delete a customer account and its profile', function () {
    $user = User::factory()->create();
    $user->assignRole('customer');

    $customer = Customer::create([
        'user_id' => $user->id,
        'phone' => '0800000000',
        'address' => 'Delete Me Street',
    ]);

    $response = $this->actingAs(customerTestAdminUser())->delete(route('customers.destroy', $customer));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('customers.index'));

    expect($user->fresh())->toBeNull();
    expect($customer->fresh())->toBeNull();
});
