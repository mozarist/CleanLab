<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ])->assignRole('customer');

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin.rinse.id@gmail.com',
            'password' => bcrypt('password'),
        ])->assignRole('admin');
    }
}
