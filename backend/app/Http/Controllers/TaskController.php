<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Category;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::with(['category', 'subtasks'])->where('user_id', auth()->id());

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }
        if ($request->has('status')) {
            $query->where('is_completed', $request->status === 'completed');
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['title' => 'required', 'category_id' => 'required|exists:categories,id']);

        $task = Task::create([
            'user_id'     => $request->user()->id,
            'category_id' => $request->category_id,
            'title'       => $request->title,
            'description' => $request->description,
            'due_date'    => $request->due_date,
        ]);

        if ($request->has('subtasks')) {
            $task->subtasks()->delete();
            foreach ($request->subtasks as $sub) {
                $task->subtasks()->create([
                    'title'        => $sub['title'],
                    'is_completed' => $sub['is_completed'] ?? false,
                ]);
            }
        }

        return response()->json($task->load('category', 'subtasks'), 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        // 1. Authorization
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 2. Capture original state before update
        $wasCompleted = $task->is_completed;

        // 3. Update the task fields
        $task->update($request->except('subtasks'));

        // 4. Auto-complete all subtasks when task is marked complete
        if ($request->has('is_completed') && $request->is_completed == true && !$wasCompleted) {
            $task->subtasks()->update(['is_completed' => true]);
        }

        // 5. Auto-uncheck all subtasks when task is marked incomplete
        if ($request->has('is_completed') && $request->is_completed == false && $wasCompleted) {
            $task->subtasks()->update(['is_completed' => false]);
        }

        // 6. Streak logic — only on transition from incomplete → complete
        if ($request->has('is_completed') && $request->is_completed == true && !$wasCompleted) {
            $this->updateStreak($request->user());
        }

        // 7. Sync subtasks if provided
        if ($request->has('subtasks')) {
            $task->subtasks()->delete();
            foreach ($request->subtasks as $sub) {
                $task->subtasks()->create([
                    'title'        => $sub['title'],
                    'is_completed' => $sub['is_completed'] ?? false,
                ]);
            }
        }

        return response()->json($task->load('category', 'subtasks'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task, Request $request)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Smart Auto-Rescheduling
     */
    public function autoReschedule(Request $request)
    {
        $tasks = Task::where('user_id', $request->user()->id)
                     ->where('is_completed', false)
                     ->where('due_date', '<', now())
                     ->get();

        foreach ($tasks as $task) {
            $task->update([
                'due_date'        => now()->addDay(),
                'auto_rescheduled' => true,
            ]);
        }

        return response()->json(['message' => 'Tasks rescheduled', 'count' => $tasks->count()]);
    }

    /**
     * Helper: Update User Streak
     */
    private function updateStreak($user)
    {
        $lastDate = $user->last_completion_date
            ? \Carbon\Carbon::parse($user->last_completion_date)
            : null;

        $today = now()->startOfDay();

        if (!$lastDate || $lastDate->diffInDays($today) > 1) {
            $user->streak_count = 1;
        } elseif ($lastDate->diffInDays($today) == 1) {
            $user->streak_count++;
        }
        // Same day — streak stays the same

        $user->last_completion_date = $today;
        $user->save();
    }
}