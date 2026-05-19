<?php

namespace Database\Factories;

use App\Models\Transactions;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Transactions>
 */
class TransactionsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(1, 10);
        $service = Service::factory()->create();
        $totalPrice = $service->price * $quantity;

        return [
            'invoice_code' => 'INV-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
            'admin_id' => User::factory(),
            'customer_id' => Customer::factory(),
            'service_id' => $service->id,
            'quantity' => $quantity,
            'total_price' => $totalPrice,
            'status' => $this->faker->randomElement(['antrian', 'dicuci', 'disetrika', 'siap_diambil', 'diambil']),
            'payment_method' => $this->faker->randomElement(['cash', 'transfer']),
            'payment_status' => $this->faker->randomElement(['pending', 'paid']),
        ];
    }
}
