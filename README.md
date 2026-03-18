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

---

## Troubleshooting

### Issue: npm install or npm run fails

If you encounter errors during `npm install` or `npm run dev`, try removing dependency files and reinstalling:

```bash
# Remove lock files and node_modules
rm -rf node_modules package-lock.json pnpm-lock.yaml

# Remove from backend
rm -rf backend/node_modules backend/package-lock.yaml backend/pnpm-lock.yaml

# Remove from frontend
rm -rf frontend/node_modules frontend/package-lock.yaml frontend/pnpm-lock.yaml

# Reinstall dependencies
npm install

# Then try running again
npm run dev
```

This clears all cached dependencies and performs a fresh install, which resolves most installation issues.