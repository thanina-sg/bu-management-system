# Library Management System - UHA

## Overview
This project is a web-based management system for the Université de Haute-Alsace library. It automates the management, handling resource searches, loans, returns, and intelligent book recommendations.

---

## Project Structure
The repository is organized into a **client-server architecture** using a **monorepo approach**:

```text
├── backend/      # Node.js Express API (Business logic and Database access)
├── frontend/     # React TypeScript Application (User Interface)
└── .gitignore    # Git exclusion rules
```

---

## Setup and Launch

### 1. Installation
Install all dependencies for both the frontend and backend directories:

```bash
npm install
```

---

### 2. Configuration
Ensure you have a `.env` file in the `backend/` directory with your database credentials:

```env
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
PORT=5000
```

---

### 3. Development Mode
To launch both the API server and the web interface simultaneously, run:

```bash
npm run dev
```

The system will be accessible at:

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```