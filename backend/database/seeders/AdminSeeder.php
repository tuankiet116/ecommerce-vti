<?php

namespace Database\Seeders;

use App\Models\AdminModel;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminModel::create([
            'email' => 'tuankiet@gmail.com',
            'password' => bcrypt('12345678'),
        ]);
    }
}
