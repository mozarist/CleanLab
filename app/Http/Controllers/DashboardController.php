<?php

namespace App\Http\Controllers;

use App\Models\Transactions;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $recentTransactions = $this->mapTransactions(
            Transactions::query()
                ->with(['customer.user', 'service'])
                ->latest()
                ->take(5)
                ->get(),
        );

        $readyToSendLaundryTransactions = $this->mapTransactions(
            Transactions::query()
                ->with(['customer.user', 'service'])
                ->where('status', 'siap_diambil')
                ->latest()
                ->take(5)
                ->get(),
        );

        return Inertia::render('dashboard', [
            'summary' => [
                'totalTransactions' => Transactions::count(),
                'totalRevenue' => (float) Transactions::where('payment_status', 'paid')->sum('total_price'),
                'pendingPayments' => Transactions::where('payment_status', 'pending')->count(),
                'readyToSendLaundry' => Transactions::where('status', 'siap_diambil')->count(),
            ],
            'recentTransactions' => $recentTransactions,
            'readyToSendLaundryTransactions' => $readyToSendLaundryTransactions,
        ]);
    }

    /**
     * @param  Collection<int, Transactions>  $transactions
     * @return array<int, array<string, mixed>>
     */
    private function mapTransactions(Collection $transactions): array
    {
        return $transactions->map(function (Transactions $transaction): array {
            return [
                'id' => $transaction->id,
                'invoice_code' => $transaction->invoice_code,
                'quantity' => $transaction->quantity,
                'total_price' => (float) $transaction->total_price,
                'payment_method' => $transaction->payment_method,
                'payment_status' => $transaction->payment_status,
                'status' => $transaction->status,
                'created_at' => $transaction->created_at?->toIso8601String(),
                'customer' => [
                    'id' => $transaction->customer?->id,
                    'user' => [
                        'id' => $transaction->customer?->user?->id,
                        'name' => $transaction->customer?->user?->name,
                    ],
                ],
                'service' => [
                    'id' => $transaction->service?->id,
                    'service_name' => $transaction->service?->service_name,
                    'unit' => $transaction->service?->unit,
                ],
            ];
        })->all();
    }
}
