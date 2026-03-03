<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Task;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function user(Request $request)
    {
        $user = $request->user();

        $tasks = $user->tasks()->with('category')->get();

        $byCategory = $tasks
            ->filter(fn($t) => $t->category !== null)
            ->groupBy('category.name')
            ->map(fn($g, $name) => [
                'name'  => $name,
                'count' => $g->count(),
            ])
            ->values();

        $weeklyActivity = $user->tasks()
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn($row) => [
                'date'  => $row->date,
                'count' => $row->count,
            ])
            ->values();

        return response()->json([
            'user' => $user,
            'stats' => [
                'total'           => $tasks->count(),
                'completed'       => $tasks->where('is_completed', true)->count(),
                'pending'         => $tasks->where('is_completed', false)->count(),
                'streak'          => $user->streak ?? 0,
                'by_category'     => $byCategory,
                'weekly_activity' => $weeklyActivity,
            ],
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('todo-app')->plainTextToken;

        if ($request->guest_task) {
            $this->saveGuestTask($user, $request->guest_task);
        }

        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('todo-app')->plainTextToken;

        if ($request->guest_task) {
            $this->saveGuestTask($user, $request->guest_task);
        }

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    private function saveGuestTask($user, $taskData)
    {
        if (empty($taskData['title'])) return;

        $categoryId = null;
        if (!empty($taskData['category_id'])) {
            $categoryId = $taskData['category_id'];
        } else {
            $fallback = Category::where('slug', 'quick')->first()
                     ?? Category::first();
            $categoryId = $fallback?->id;
        }

        if (!$categoryId) return;

        Task::create([
            'user_id'     => $user->id,
            'category_id' => $categoryId,
            'title'       => $taskData['title'],
            'description' => $taskData['description'] ?? null,
            'due_date'    => !empty($taskData['due_date'])
                                ? $taskData['due_date']
                                : null,
        ]);
    }
}