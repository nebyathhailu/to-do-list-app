<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $categories = [
            [
                'name' => 'Urgent',
                'slug' => 'urgent',
                'priority_level' => 'high',
                'energy_level' => 'high',
                'color' => '#8d77a8',
                'icon' => 'Fire',
                'feature_description' => 'Time-sensitive tasks that need immediate attention.'
            ],
            [
                'name' => 'Quick',
                'slug' => 'quick',
                'priority_level' => 'high',
                'energy_level' => 'low',
                'color' => '#b8a3d4',
                'icon' => 'Bolt',
                'feature_description' => 'High impact, low effort tasks you can knock out fast.'
            ],
            [
                'name' => 'Focus',
                'slug' => 'focus',
                'priority_level' => 'medium',
                'energy_level' => 'high',
                'color' => '#c4addd',
                'icon' => 'Lightbulb',
                'feature_description' => 'Deep work requiring sustained concentration.'
            ],
            [
                'name' => 'Low Energy',
                'slug' => 'low-energy',
                'priority_level' => 'low',
                'energy_level' => 'low',
                'color' => '#9e89bc',
                'icon' => 'Leaf',
                'feature_description' => 'Light tasks for when your energy is low.'
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
