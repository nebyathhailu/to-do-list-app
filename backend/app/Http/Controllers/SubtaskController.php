<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Subtask;
use Illuminate\Http\Request;

class SubtaskController extends Controller
{
    public function update(Request $request, Task $task, Subtask $subtask)
    {
        // Ensure the subtask belongs to the task, and the task belongs to the user
        if ($subtask->task_id !== $task->id || $task->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $subtask->update([
            'is_completed' => $request->boolean('is_completed'),
        ]);

        return response()->json($subtask);
    }
}