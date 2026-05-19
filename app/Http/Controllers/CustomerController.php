<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::with('user')->paginate(10);

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Customers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($validated): void {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
            ]);

            $user->assignRole('customer');

            Customer::create([
                'user_id' => $user->id,
                'phone' => $validated['phone'],
                'address' => $validated['address'],
            ]);
        });

        return redirect()->route('customers.index')
            ->with('success', 'Customer created successfully!');
    }

    public function edit(Customer $customer)
    {
        $customer->load('user');

        return Inertia::render('Admin/Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($customer->user_id)],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
        ]);

        DB::transaction(function () use ($customer, $validated): void {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (! empty($validated['password'])) {
                $userData['password'] = $validated['password'];
            }

            if ($customer->user->email !== $validated['email']) {
                $userData['email_verified_at'] = null;
            }

            $customer->user->update($userData);

            $customer->update([
                'phone' => $validated['phone'],
                'address' => $validated['address'],
            ]);
        });

        return redirect()->route('customers.index')
            ->with('success', 'Customer updated successfully!');
    }

    public function destroy(Customer $customer)
    {
        DB::transaction(function () use ($customer): void {
            $customer->user()->delete();
        });

        return redirect()->route('customers.index')
            ->with('success', 'Customer deleted successfully!');
    }
}
