# Task Manager — Full Stack Application

A modern, full-stack Task Management application built with a clean black-and-white glassmorphism UI. Supports role-based access for Admin and Members with full project and task management capabilities.

---

## Live Demo

- **Application Link:** https://task-manager-52d7.onrender.com
- **Note:**The backend might take 5 - 10 seconds to start.

---

## Features

### Authentication

- User Signup and Login with secure cookie-based sessions
- Role-based access control — Admin and Member roles
- Protected routes based on user role

### Home Page

- Clean landing page with hero section
- Glassmorphism decorative stat cards
- Login / Signup CTA button

### Projects Dashboard

- View all available projects after login
- Each project card shows name, description, and task count
- Admin-only option to create new projects

### Task Management

- View all tasks under a selected project
- Tasks grouped into Active and Completed sections
- Create new tasks (Admin only) with title, description, due date, and status
- Newly created tasks highlight with a glow animation

### Task Assignment (Admin Only)

- Searchable member dropdown per task
- Assign any member to a task
- Reassign tasks — automatically removes from previous assignee
- Only one dropdown opens at a time (no UI conflicts)
- Avatar initials shown for each member

### Task Status Updates (Admin + Member)

- Inline three-segment status toggle — Todo / In Progress / Done
- Status updates in real time via API
- Tasks marked as Done automatically move to the Completed section with smooth animation

### UI Design

- Pure black base background with white glassmorphism layers
- Slim horizontal task cards with hover lift effect
- Floating assign dropdown with smooth fade and slide animations
- Consistent medium-sized buttons throughout
- Bottom-center toast notifications with auto-dismiss
- Fully responsive — desktop and mobile

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios
- React Router DOM

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cookie Parser
- CORS
- Morgan

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
git clone https://github.com/your-username/task-manager-backend.git
cd task-manager-backend
npm install
```

Create a `.env` file in the root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

### Frontend Setup

```bash
git clone https://github.com/your-username/task-manager-frontend.git
cd task-manager-frontend
npm install
```

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Start the dev server:

```bash
npm run dev
```

---
