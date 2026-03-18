# 📚 Library Management System - Application Resume

**Project Name:** Library Management System - UHA (Université de Haute-Alsace)  
**Version:** 1.0.0  
**Type:** Full-Stack Web Application  
**Architecture:** Client-Server (Monorepo)

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [User Portals](#user-portals)
5. [Core Features](#core-features)
6. [Authentication System](#authentication-system)
7. [Database Structure](#database-structure)
8. [API Endpoints](#api-endpoints)
9. [Functionalities by Role](#functionalities-by-role)
10. [Special Features](#special-features)

---

## 🎯 Overview

**Purpose:** A comprehensive web-based library management system for managing university library resources, including book catalogs, loans, returns, reservations, and intelligent book recommendations.

**Key Goals:**
- Automate library resource management
- Provide intuitive interfaces for students, teachers, librarians, and administrators
- Enable real-time tracking of loans and reservations
- Deliver intelligent book recommendations using AI
- Maintain comprehensive statistics and analytics
- Ensure secure authentication and role-based access control

**Users Served:**
- **Students** - Browse books, manage loans, reserve books
- **Teachers** - Similar access to students with educational focus
- **Librarians** - Manage inventory, process loans/returns, handle reservations
- **Administrators** - Full system access, user management, analytics

---

## 🏗️ System Architecture

### Overall Structure
```
┌─────────────────────────────────┐
│   Frontend (React 19 + TypeScript)
│   Port: 5173 (Vite Dev Server)
│   Technology: React Router, Tailwind CSS
└──────────────┬──────────────────┘
               │ HTTP/HTTPS
               │ REST API Calls
               ↓
┌─────────────────────────────────┐
│   Backend (Node.js + Express)
│   Port: 5000
│   Contains: Routes, Controllers, Models
└──────────────┬──────────────────┘
               │ Supabase Client SDK
               │
               ↓
┌─────────────────────────────────┐
│   PostgreSQL Database (Supabase)
│   Tables: utilisateur, livre, exemplaire,
│           emprunt, reservation, penalite,
│           livre_similitude
└─────────────────────────────────┘
```

### Data Flow
1. **Frontend** - React components handle UI and user interactions
2. **API Service Layer** - `src/lib/api.ts` makes HTTP requests with authentication headers
3. **Express Routes** - Route incoming requests to appropriate controllers
4. **Controllers** - Process requests and call model functions
5. **Models** - Execute business logic and database queries
6. **Database** - Persistent data storage via Supabase PostgreSQL

---

## 💻 Technology Stack

### 🧠 Programming Languages Used

#### Frontend Languages
| Language | Version | Usage | File Extensions |
|---|---|---|---|
| **TypeScript** | 5.9 | Type-safe application logic | `.ts`, `.tsx` |
| **JavaScript** | ES2024+ | Interoperability and dynamic features | `.js`, `.jsx` |
| **TSX/JSX** | - | React component syntax | `.tsx`, `.jsx` |
| **CSS3** | - | Styling (via Tailwind) | `.css` |
| **HTML5** | - | Markup structure | `.html` |

#### Backend Languages
| Language | Version | Usage | File Extensions |
|---|---|---|---|
| **JavaScript (Node.js)** | ES2024+ | Server-side application logic | `.js` |
| **SQL** | PostgreSQL dialect | Database queries and operations | `.sql` (in Supabase) |

#### AI Integration
| Language | Used For |
|---|---|
| **Python** | Ollama/Llama 3 AI model (local inference server) |

---

### Frontend Technologies
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.4 | UI Framework & component library |
| **TypeScript** | 5.9 | Type safety for JavaScript |
| **React Router** | 7.13.1 | Client-side routing & navigation |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS styling framework |
| **Vite** | 8.0.0 | Lightning-fast build tool & dev server |
| **PostCSS** | 8.5.8 | CSS processor for Tailwind |
| **Autoprefixer** | 10.4.27 | Automatic vendor prefixes for CSS |

### Backend Technologies
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS (21) | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web framework & HTTP server |
| **Supabase Client** | 2.99.1 | PostgreSQL database client |
| **PostgreSQL** | - | Relational database (via Supabase) |
| **JWT (jsonwebtoken)** | 9.0.0 | Token-based authentication |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Swagger UI** | 5.0.0 | API documentation interface |
| **YAML.js** | 0.3.0 | Swagger/OpenAPI file parsing |

### AI & ML Technologies
| Technology | Purpose | Configuration |
|---|---|---|
| **Ollama** | Local AI inference server | Default: `http://localhost:11434` |
| **Llama 3** | Large Language Model | Default model: `llama3` |
| **Node.js Ollama SDK** | Node.js integration with Ollama | API communication |

### Development Tools & Supporting Libraries
| Tool | Version | Purpose |
|---|---|---|
| **Nodemon** | 3.0.0 | Automatic server restart on file changes |
| **ESLint** | 9.39.4 | JavaScript/TypeScript linting |
| **Typography** | - | Text rendering & formatting |
| **TSX** | 4.21.0 | Execute TypeScript directly |
| **DotEnv** | 16.0.0 | Environment variable management |

---

### Tech Stack by Layer

| Layer | Primary Tech | Supporting Tech |
|---|---|---|
| **Frontend UI** | React 19 + TypeScript | Tailwind CSS, React Router |
| **Frontend Build** | Vite 8.0 | PostCSS, Autoprefixer |
| **Backend API** | Express.js + Node.js | CORS, JWT, Supabase SDK |
| **Database** | PostgreSQL 15+ | Supabase hosting, SQL |
| **Authentication** | JWT Tokens | bcrypt (password hashing) |
| **AI Integration** | Ollama + Llama 3 | Local Python inference |
| **API Documentation** | Swagger UI + OpenAPI | YAML schema |

---

## 🚪 User Portals

### 1. **Student/Teacher Portal** 
**Access:** `http://localhost:5173`

**Main Features:**
- Browse and search book catalog
- View book details and recommendations
- Manage personal loans (active and history)
- View and manage reservations
- Account dashboard with profile info

**Pages:**
- **HomePage** - Book catalog with search and filtering
- **DetailsPage** - Individual book details with recommendations
- **StudentDashboard** - Personal loans and reservations management
- **AccountPanel** - Login/logout and user account

**Components:**
- `StudentLoginView` - Email/password authentication
- `StudentDashboard` - Loan history, active loans, and reservations tabs
- `SearchOverlay` - Real-time instant search
- `ReservationModal` - Request book reservations
- `StatusBadges` - Visual loan status indicators

---

### 2. **Librarian Portal**
**Access:** `http://localhost:5173/librarian`

**Main Features:**
- Add and manage book inventory
- Process student loan transactions
- Handle book returns and process returns
- Manage book reservations and queue
- View system-wide statistics and analytics
- Manage user accounts (create, edit, delete)

**Pages:**
- **LibrarianPage** - Main staff dashboard with all management panels
- **DashboardCards** - Statistics overview (books, loans, reservations)

**Components in Librarian Portal:**
- `BooksPanel` - Book inventory management (add, edit, delete)
- `AddBookForm` - Create new book entries with metadata
- `LoanForm` - Register new book loans for students
- `ReturnForm` - Process book returns
- `ReservationsPanel` - Manage reservation queue
- `UsersPanel` - User account management (admin only features)
- `AddUserForm` - Create new user accounts

**Sub-pages:**
- Book Management
- Loan Management
- Return Management
- Reservation Management
- User Management

---

### 3. **Admin Panel** (Access: Integrated in Librarian Portal)
**Additional Admin-Only Features:**
- User management (create, edit, delete users)
- Role assignment and permission control
- Full database access and analytics
- System-wide statistics and reporting

---

## ⚙️ Core Features

### 📖 Book Management
- **Browse Books** - Full catalog with pagination
- **Search & Filter** - By title, author, category, availability status
- **Book Details** - Title, author, ISBN, year, category, location, description, cover image
- **Add Books** - Staff can add new books to inventory
- **Update Books** - Modify book information (status, location, availability)
- **Delete Books** - Remove books from system (admin only)
- **Book Statistics** - Track borrowed vs available copies

### 🔐 User Authentication & Management
- **Student/Teacher Login** - Email and password authentication
- **Staff Login** - Librarian and Admin access
- **User Registration** - Create new student/teacher accounts
- **Role-Based Access Control** - RBAC for Student, Teacher, Librarian, Admin
- **JWT Token Management** - Secure session tokens
- **User Profile** - View and manage user information
- **User Management** - Admin can create, edit, delete users

### 📕 Loan Management
- **Create Loan** - Register new book loans with expected return dates
- **Track Active Loans** - View all active loans with due dates
- **Return Management** - Process book returns and update loan status
- **Overdue Detection** - Automatic identification of overdue loans
- **Loan History** - View completed loan transactions
- **Fine/Penalty System** - Automatic penalties for overdue books

### 📋 Reservation System
- **Create Reservation** - Students can reserve borrowed books
- **Queue Management** - Automatic queue position assignment
- **Reservation Tracking** - View all made reservations with status
- **Cancellation** - Students/staff can cancel reservations
- **Status Updates** - Track reservation status (Pending, Ready, Cancelled)
- **Notification** - System tracks when reserved books become available

### 📊 Analytics & Statistics
- **Dashboard Statistics** - Total books, available books, borrowed books
- **Loan Metrics** - Active loans, overdue loans count
- **Reservation Metrics** - Pending reservations
- **User Statistics** - Total users and role distribution
- **Real-time Updates** - Stats refresh on demand

### 🤖 AI Assistant
- **Ollama Integration** - Local AI model (Llama 3) integration
- **Natural Language Queries** - Ask questions about books in natural language
- **Smart Recommendations** - AI-powered book recommendations based on:
  - User borrowing history
  - Book similarity metrics
  - Category preferences
- **Contextual Answers** - AI provides relevant answers about:
  - Book availability
  - Recommended reading
  - Stock status
  - Specific book searches

---

## 🔐 Authentication System

### Authentication Methods

**1. Student/Teacher Authentication**
- **Endpoint:** `POST /api/auth/student/login`
- **Method:** Email + Password
- **Token:** JWT (JSON Web Token)
- **Storage:** localStorage (Bearer token)
- **Duration:** Session-based

**2. Staff Authentication**
- **Endpoint:** `POST /api/auth/staff/login`
- **Method:** Email + Password (restricted to Librarian/Admin roles)
- **Token:** JWT
- **Verification:** Role verification on backend
- **Access Control:** Only users with Librarian or Admin roles can login

**3. Registration**
- **Endpoint:** `POST /api/auth/register`
- **Fields:** Email, name, role
- **User Roles:** ETUDIANT (Student), ENSEIGNANT (Teacher), BIBLIOTHECAIRE (Librarian)

**4. Logout**
- **Endpoint:** `POST /api/auth/logout`
- **Action:** Invalidate token and clear session

### Security Features
- ✅ JWT token-based authentication
- ✅ Authorization headers on all API requests
- ✅ Role-based access control (RBAC)
- ✅ Protected routes (client-side validation)
- ✅ Secure password handling
- ✅ CORS configuration for cross-origin requests

---

## 💾 Database Structure

### Schema Overview

**Tables (PostgreSQL via Supabase):**

#### 1. **utilisateur** (Users)
- `id_utilisateur` - Primary key
- `email` - User email (unique)
- `mot_de_passe` - Encrypted password
- `nom` - Last name
- `prenom` - First name
- `role` - User role (ETUDIANT, ENSEIGNANT, BIBLIOTHECAIRE, ADMIN)
- `date_creation` - Account creation date

#### 2. **livre** (Books)
- `isbn` - Primary key (ISBN)
- `titre` - Book title
- `auteur` - Author name
- `categorie` - Category/Subject (e.g., "Computer Science", "Software Engineering")
- `description` - Book description
- `annee_publication` - Publication year
- `url_couverture` - Cover image URL

#### 3. **exemplaire** (Book Copies)
- `id_exemplaire` - Primary key
- `isbn` - Foreign key to livre
- `localisation` - Physical location in library
- `disponibilite` - Boolean (available/borrowed)
- `date_dernier_retour` - Last return date

#### 4. **emprunt** (Loans)
- `id_emprunt` - Primary key
- `id_utilisateur` - Foreign key to utilisateur
- `isbn` - Foreign key to livre
- `date_emprunt` - Loan start date
- `date_retour_prevue` - Expected return date
- `date_retour_reelle` - Actual return date (NULL if not returned)
- `statut` - Loan status (ACTIF, RETOURNE, RETARD)

#### 5. **reservation** (Reservations)
- `id_reservation` - Primary key
- `id_utilisateur` - Foreign key to utilisateur
- `isbn` - Foreign key to livre
- `date_reservation` - Reservation creation date
- `position_file` - Queue position
- `statut` - Status (EN_ATTENTE, PRETE, ANNULEE)

#### 6. **penalite** (Penalties)
- `id_penalite` - Primary key
- `id_emprunt` - Foreign key to emprunt
- `montant` - Fine amount
- `raison` - Reason for penalty (e.g., overdue)
- `date_penalite` - Penalty date

#### 7. **livre_similitude** (Recommendations)
- `isbn1` - Book ISBN
- `isbn2` - Similar book ISBN
- `score_similitude` - Similarity score (0-1)

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/student/login     - Student login
POST   /api/auth/staff/login       - Staff/Admin login
POST   /api/auth/logout            - User logout
GET    /api/auth/me                - Get current user profile
```

### Book Management Endpoints
```
GET    /api/books                  - Get all books (with filters)
GET    /api/books/:id              - Get single book details
GET    /api/books/:id/recommendations - Get recommended books
POST   /api/books                  - Create new book (staff)
PUT    /api/books/:id              - Update book (staff)
DELETE /api/books/:id              - Delete book (admin)
```

### Loan Management Endpoints
```
GET    /api/loans                  - Get loans (filterable by student/status)
GET    /api/loans/:id              - Get single loan
POST   /api/loans                  - Create new loan (staff)
PUT    /api/loans/:id              - Update loan
PUT    /api/loans/:id/return       - Process book return (staff)
```

### Reservation Endpoints
```
GET    /api/reservations           - Get all reservations
GET    /api/reservations/:id       - Get single reservation
POST   /api/reservations           - Create new reservation
PUT    /api/reservations/:id       - Update reservation (staff)
DELETE /api/reservations/:id       - Cancel reservation
```

### User Management Endpoints
```
GET    /api/users                  - Get all users (admin)
GET    /api/users/me               - Get current user
POST   /api/users                  - Create new user (admin)
PUT    /api/users/:id              - Update user (admin)
DELETE /api/users/:id              - Delete user (admin)
```

### Statistics Endpoints
```
GET    /api/stats                  - Get library statistics
```

### AI Assistant Endpoints
```
POST   /api/ai/query               - Ask AI assistant a question
```

---

## 👥 Functionalities by Role

### 👨‍🎓 Student / Teacher Roles
**Permissions:**
- ✅ View book catalog
- ✅ Search and filter books
- ✅ View book details
- ✅ View personal loans
- ✅ View loan history
- ✅ View personal reservations
- ✅ Create new reservations
- ✅ Cancel own reservations
- ✅ View profile information
- ✅ Ask AI assistant questions

**Restrictions:**
- ❌ Cannot add/edit books
- ❌ Cannot delete books
- ❌ Cannot process loans/returns
- ❌ Cannot manage other users
- ❌ Cannot access admin panel

---

### 📚 Librarian Role
**Permissions:**
- ✅ All Student/Teacher permissions
- ✅ Add new books to catalog
- ✅ Edit book information
- ✅ View all active loans
- ✅ Create new loans (process checkouts)
- ✅ Process book returns
- ✅ Manage all reservations
- ✅ View all users
- ✅ View system statistics
- ✅ Create new user accounts

**Restrictions:**
- ❌ Cannot delete books
- ❌ Cannot delete users
- ❌ Cannot assign admin roles

---

### 🔑 Admin Role
**Permissions:**
- ✅ All Librarian/Staff permissions
- ✅ Delete books from catalog
- ✅ Delete user accounts
- ✅ Manage all user roles and permissions
- ✅ Full system access
- ✅ View all analytics and statistics
- ✅ System-wide configuration access

**Restrictions:**
- None (Full system access)

---

## 🚀 Special Features

### 1. **AI-Powered Book Recommendations**
- **Technology:** Ollama with Llama 3 model
- **Features:**
  - Recommend books based on user borrowing history
  - Suggest similar books based on content similarity
  - Answer natural language queries about books
  - Provide intelligent suggestions for reading

### 2. **Real-time Statistics Dashboard**
- Total books in collection
- Available vs borrowed books
- Active loans count
- Overdue loans detection
- Pending reservations count
- User demographics

### 3. **Automatic Penalty System**
- Automatic detection of overdue loans
- Penalty creation for late returns
- Fine amount calculation
- Penalty history tracking

### 4. **Advanced Search & Filtering**
- Multi-field search (title, author, category)
- Category-based filtering
- Status-based filtering (Available/Borrowed)
- Real-time search results (client-side)

### 5. **Reservation Queue Management**
- Automatic queue position assignment
- FIFO (First-In-First-Out) queue processing
- Status tracking (Pending → Ready → Fulfilled)
- Cancellation support with queue adjustment

### 6. **Book Recommendation System**
- Similarity scoring between books
- ML-based recommendation algorithms
- User history-based suggestions
- Category-based recommendations

### 7. **Comprehensive Audit Trail**
- Loan history tracking
- Return date tracking (expected vs actual)
- Overdue status tracking
- User activity logs
- Penalty history

---

## 📱 Responsive Design

**Frontend Features:**
- ✅ Mobile-responsive design (Tailwind CSS)
- ✅ Touch-friendly interface
- ✅ Adaptive layouts for all screen sizes
- ✅ Dark/Light theme compatible
- ✅ Fast load times (Vite optimization)

---

## 🔄 Workflow Examples

### Typical Student Workflow
1. Visit homepage
2. Browse book catalog or use search
3. Click on book details
4. Read description and recommendations
5. Log in to account
6. View personal loans and due dates
7. Make a reservation if book is borrowed
8. Check dashboard for status updates

### Typical Librarian Workflow
1. Log in with staff credentials
2. View dashboard statistics
3. Process new loans (using LoanForm)
4. Process book returns (using ReturnForm)
5. Manage reservations queue
6. Add new books to catalog
7. Update book information
8. View all user accounts

### Typical Admin Workflow
1. Access admin features in librarian portal
2. Manage user accounts (create, edit, delete)
3. Assign roles to users
4. Delete problematic book entries
5. View system-wide analytics
6. Monitor system health

---

## ⚡ Performance Features

- **Lazy Loading** - Components load on demand
- **Client-side Filtering** - Instant search results
- **Async/Await** - Non-blocking operations
- **Caching** - localStorage for authentication tokens
- **Optimized Queries** - Efficient database queries
- **Vite Bundling** - Fast build and load times

---

## 🔒 Security Measures

- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Password encryption
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling without sensitive data exposure
- ✅ Protected API routes
- ✅ Authorization header validation

---

## 📦 Deployment Structure

```
bu-management-system/
├── backend/                 # Node.js + Express
│   ├── controllers/         # Request handlers
│   ├── models/              # Business logic & DB queries
│   ├── routes/              # API route definitions
│   ├── db.js               # Database connection
│   ├── index.js            # Express app setup
│   └── package.json        # Backend dependencies
│
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions & API calls
│   │   └── main.tsx        # App entry point
│   └── package.json        # Frontend dependencies
│
└── package.json            # Root scripts (npm run dev)
```

---

## 🚀 Getting Started

### Installation
```bash
npm install  # Install dependencies for both frontend and backend
```

### Environment Setup
Create `.env` file in backend directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=5000
```

### Development Mode
```bash
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api-docs (Swagger UI)

---

## 📝 Summary

The **Library Management System** is a comprehensive, full-stack web application that automates the management of university library resources. It provides intuitive portals for students, teachers, librarians, and administrators, with features including:

- 📖 Complete book catalog management
- 🔐 Secure role-based authentication
- 📕 Loan and return processing
- 📋 Reservation queue management
- 📊 Real-time statistics and analytics
- 🤖 AI-powered book recommendations
- 👥 User account management
- 💾 Persistent PostgreSQL database
- 🎨 Responsive modern UI with Tailwind CSS
- ⚡ Fast performance with Vite

This system streamlines library operations, improves user experience, and leverages AI technology to provide intelligent recommendations and support.

---

**Last Updated:** March 2026  
**Project Status:** Fully Functional  
**Version:** 1.0.0
