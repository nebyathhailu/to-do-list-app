<?php

namespace App\Http\Controllers;

use App\Models\Task;      
use App\Models\Category; 
use Illuminate\Http\Request;

    // ... rest of your code
class DashboardController extends Controller
{
    public function stats(Request $request)
        {
            $user = $request->user();
            
            $completedCount = Task::where('user_id', $user->id)->where('is_completed', true)->count();
            $pendingCount = Task::where('user_id', $user->id)->where('is_completed', false)->count();
            
            // Productivity by Category
            $byCategory = Task::where('user_id', $user->id)
                            ->selectRaw('category_id, count(*) as total')
                            ->groupBy('category_id')
                            ->with('category:id,name,color')
                            ->get();

            // Weekly Activity
            $weekly = Task::where('user_id', $user->id)
                        ->where('is_completed', true)
                        ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
                        ->selectRaw('DATE(updated_at) as date, count(*) as count')
                        ->groupBy('date')
                        ->get();

            return response()->json([
                'streak' => $user->streak_count,
                'completed' => $completedCount,
                'pending' => $pendingCount,
                'by_category' => $byCategory,
                'weekly_activity' => $weekly
            ]);
        }
}
