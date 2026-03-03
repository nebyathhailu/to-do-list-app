<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'index']); // Public for guest usage

// Protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::apiResource('tasks', TaskController::class);
    Route::post('/tasks/reschedule', [TaskController::class, 'autoReschedule']);
    Route::put('/tasks/{task}/subtasks/{subtask}', [App\Http\Controllers\SubtaskController::class, 'update']);
    
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});