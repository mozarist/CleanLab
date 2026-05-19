<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Service;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transactions::with(['customer.user', 'service', 'admin'])
            ->latest('id')
            ->paginate(10);
        $customers = Customer::select('id', 'user_id')->with('user')->get();
        $services = Service::select('id', 'service_name', 'price', 'unit')->get();

        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions,
            'customers' => $customers,
            'services' => $services,
        ]);
    }

    public function create()
    {
        $customers = Customer::select('id', 'user_id')->with('user')->get();
        $services = Service::select('id', 'service_name', 'price', 'unit')->get();

        return Inertia::render('Admin/Transactions/Create', [
            'customers' => $customers,
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'service_id' => ['required', 'exists:services,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'payment_method' => ['nullable', 'in:cash,transfer'],
            'payment_status' => ['required', 'in:pending,paid'],
        ]);

        // Get service price and calculate total
        $service = Service::findOrFail($validated['service_id']);
        $totalPrice = $service->price * $validated['quantity'];

        Transactions::create([
            'invoice_code' => $this->generateInvoiceCode(),
            'admin_id' => $request->user()->id,
            'customer_id' => $validated['customer_id'],
            'service_id' => $validated['service_id'],
            'quantity' => $validated['quantity'],
            'total_price' => $totalPrice,
            'status' => 'antrian',
            'payment_method' => $validated['payment_method'],
            'payment_status' => $validated['payment_status'],
        ]);

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction created successfully!');
    }

    public function edit(Transactions $transaction)
    {
        $transaction->load(['customer.user', 'service', 'admin']);
        $customers = Customer::select('id', 'user_id')->with('user')->get();
        $services = Service::select('id', 'service_name', 'price', 'unit')->get();

        return Inertia::render('Admin/Transactions/Edit', [
            'transaction' => $transaction,
            'customers' => $customers,
            'services' => $services,
        ]);
    }

    public function update(Request $request, Transactions $transaction)
    {
        $validated = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'service_id' => ['required', 'exists:services,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:antrian,dicuci,disetrika,siap_diambil,diambil'],
            'payment_method' => ['nullable', 'in:cash,transfer'],
            'payment_status' => ['required', 'in:pending,paid'],
        ]);

        // Get service price and calculate total
        $service = Service::findOrFail($validated['service_id']);
        $totalPrice = $service->price * $validated['quantity'];

        $transaction->update([
            'customer_id' => $validated['customer_id'],
            'service_id' => $validated['service_id'],
            'quantity' => $validated['quantity'],
            'total_price' => $totalPrice,
            'status' => $validated['status'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => $validated['payment_status'],
        ]);

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction updated successfully!');
    }

    public function destroy(Transactions $transaction)
    {
        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction deleted successfully!');
    }

    /**
     * Generate unique invoice code
     */
    private function generateInvoiceCode(): string
    {
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(6));

        return "INV-{$date}-{$random}";
    }
}
