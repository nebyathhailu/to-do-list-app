# ✦ To-Do App

> **Task management, simplified.** Plan with clarity, track your progress, and stop feeling overwhelmed.

🔗 **Live App:** [URL](https://to-do-list-app-two-eta.vercel.app)

---

## Overview

To-Do App is a full-stack productivity app built using Laravel for backend and React for frontend. It lets you organize tasks by category and energy level, break them into subtasks, and track your streaks over time — all wrapped in a dark/light themed interface.

The app supports a guest mode on the landing page: visitors can create a task without an account, and it gets carried over automatically when they register.

---

## Features

- **Task management** — Create, edit, delete and complete tasks with optional descriptions and due dates
- **Subtasks** — Break any task into subtasks with an inline progress bar
- **Categories** — Color-coded categories to organize tasks by type or energy level
- **Auto-reschedule** — Overdue tasks can be bulk-rescheduled with one click
- **Dashboard** — Weekly productivity bar chart and category breakdown pie chart
- **Streak tracking** — Tracks consecutive days of task completion
- **Guest mode** — Try the app before signing up; your task is saved when you register
- **Dark / Light theme** — Toggled globally, persisted across sessions
- **Responsive** — Fully usable on mobile, tablet, and desktop

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v4 with CSS custom properties for theming |
| Charts | Recharts |
| Font | Playfair Display (Google Fonts) |
| HTTP | Axios |

### Backend
| | |
|---|---|
| Framework | Laravel 11 |
| Auth | Laravel Sanctum (token-based) |
| Database | MySQL |
| API | RESTful JSON API |

---

## Screenshots

<div align="center">
  <img width="32%" src="https://github.com/user-attachments/assets/6270b490-7828-4db0-9079-5e66002dec3d"><br>Landing
  <img width="32%" src="https://github.com/user-attachments/assets/0ac56666-14c0-4e3e-bec0-ef5d5ff39731"><br>Dashboard
  <img width="32%" src="https://github.com/user-attachments/assets/274b60e5-8997-40a8-a05a-916ba4df8b3e"><br>Mobile
</div>

---

## Getting Started

### Prerequisites

- Node.js 18+
- PHP 8.2+ with Composer
- MySQL

---

### Frontend Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/To-Do App.git
cd To-Do App/frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Set VITE_API_URL to your backend URL, e.g. http://localhost:8000/api

# Start dev server
npm run dev
```

---

### Backend Setup

```bash
cd To-Do App/backend

# Install dependencies
composer install

# Copy and configure environment
cp .env.example .env
# Set DB_DATABASE, DB_USERNAME, DB_PASSWORD
# Set FRONTEND_URL to your frontend URL (for CORS)

# Generate app key
php artisan key:generate

# Run migrations and seed categories
php artisan migrate
php artisan db:seed --class=CategorySeeder

# Start the server
php artisan serve
```

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header obtained from login or register.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | — | Register a new user |
| `POST` | `/login` | — | Log in, returns token |
| `POST` | `/logout` | ✓ | Invalidate token |
| `GET` | `/user` | ✓ | Get authenticated user |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/tasks` | ✓ | List all tasks (filter: `?status=pending\|completed`) |
| `POST` | `/tasks` | ✓ | Create a task |
| `PUT` | `/tasks/:id` | ✓ | Update a task |
| `DELETE` | `/tasks/:id` | ✓ | Delete a task |
| `POST` | `/tasks/reschedule` | ✓ | Bulk reschedule overdue tasks |

### Subtasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `PUT` | `/tasks/:id/subtasks/:subId` | ✓ | Toggle subtask completion |

### Categories & Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/categories` | — | List all categories (public) |
| `GET` | `/dashboard/stats` | ✓ | Totals, streak, weekly activity, by-category breakdown |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/          # Button, Input, Modal, Badge
│   │   ├── Dashboard.jsx
│   │   ├── Navbar.jsx
│   │   ├── TaskForm.jsx
│   │   └── TaskItem.jsx
│   ├── context/         # AuthContext, ThemeContext
│   ├── hooks/           # useApi, useLocalStorage
│   ├── layouts/         # MainLayout
│   ├── pages/           # LandingPage, LoginPage, RegisterPage, DashboardPage
│   └── utils/           # axios instance

backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   ├── TaskController.php

│   │   ├── SubtaskController.php
│   │   ├── CategoryController.php
│   │   └── DashboardController.php
│   └── Models/          # User, Task, Subtask, Category
├── database/
│   ├── migrations/
│   └── seeders/         # CategorySeeder
└── routes/
    └── api.php
```

---

## Design

To-Do App uses a custom purple palette — `#1b0e20` through `#d1c0ec` — implemented as CSS custom properties so the dark and light themes share the same component markup with no duplication. All tokens are defined in `index.css` and consumed via Tailwind's arbitrary value syntax (`text-[var(--text-primary)]`).

Typography is set globally via `html { font-family: 'Playfair Display' }` at `150%` base size, so all `rem` values scale proportionally without per-component overrides.

---

## License

MIT — use it, fork it, build on it.
