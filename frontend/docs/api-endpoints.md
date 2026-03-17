# API Endpoint Documentation

REST API endpoints required for the University Library Management System to work with a real backend.

---

## Authentication

### `POST /api/auth/student/login`
Authenticate a student or teacher user.
- **Request**: `{ email: string, password: string }`
- **Response**: `{ user: User, token: string }`
- **Connected to**: `StudentLoginView` (Account panel login)

### `POST /api/auth/staff/login`
Authenticate a librarian or admin user.
- **Request**: `{ email: string, password: string }`
- **Response**: `{ user: User, role: "Librarian" | "Admin", token: string }`
- **Connected to**: `StaffLoginForm` (Staff Portal login)

### `POST /api/auth/logout`
Invalidate the current session.
- **Connected to**: Sign Out buttons in `StudentDashboard`, `LibrarianPage`

---

## Books

### `GET /api/books`
List all books with optional filtering.
- **Query params**: `?q=string&category=string&status=string`
- **Response**: `Book[]`
- **Connected to**: `HomePage` (catalog grid), `SearchOverlay` (instant search), `BooksPanel` (staff book table)

### `GET /api/books/:id`
Get a single book by ID.
- **Response**: `Book`
- **Connected to**: `DetailsPage` (book detail view)

### `GET /api/books/:id/recommendations`
Get recommended books based on borrowing patterns.
- **Response**: `Book[]`
- **Connected to**: `DetailsPage` (recommended resources section)

### `POST /api/books`
Add a new book to the catalog. Requires staff authentication.
- **Request**: `{ title, author, isbn, year, category, location, description }`
- **Response**: `Book`
- **Connected to**: `AddBookForm`

### `PUT /api/books/:id`
Update a book's details (status, location, category). Requires staff authentication.
- **Request**: `{ status?, location?, category? }`
- **Response**: `Book`
- **Connected to**: `BooksPanel` (inline edit)

### `DELETE /api/books/:id`
Remove a book from the catalog. Requires admin authentication.
- **Response**: `204 No Content`
- **Connected to**: `BooksPanel` (delete button, admin only)

---

## Loans

### `GET /api/loans`
List loans, optionally filtered by student.
- **Query params**: `?studentId=string&status=Active|Returned|Overdue`
- **Response**: `Loan[]`
- **Connected to**: `StudentDashboard` (loan history tab), `DashboardCards` (loan counts)

### `POST /api/loans`
Register a new loan. Requires staff authentication.
- **Request**: `{ studentId: string, isbn: string, loanDate: string, returnDateExpected: string }`
- **Response**: `Loan`
- **Connected to**: `LoanForm`

### `PUT /api/loans/:id/return`
Register a book return. Requires staff authentication.
- **Request**: `{ returnDateActual: string }`
- **Response**: `Loan` (with updated status and late info)
- **Connected to**: `ReturnForm`

---

## Reservations

### `GET /api/reservations`
List all reservations, optionally filtered by student or status.
- **Query params**: `?studentId=string&status=Pending|Ready|Cancelled`
- **Response**: `Reservation[]`
- **Connected to**: `StudentDashboard` (reservations tab), `ReservationsPanel` (staff table), `DashboardCards`

### `POST /api/reservations`
Create a new reservation for a borrowed book.
- **Request**: `{ studentId: string, isbn: string }`
- **Response**: `Reservation` (includes assigned queuePosition)
- **Connected to**: `ReservationModal` (book detail page)

### `PUT /api/reservations/:id`
Update a reservation's status. Requires staff authentication.
- **Request**: `{ status: "Pending" | "Ready" | "Cancelled" }`
- **Response**: `Reservation`
- **Connected to**: `ReservationsPanel` (inline edit)

### `DELETE /api/reservations/:id`
Cancel a reservation. Available to the owning student or staff.
- **Response**: `204 No Content`
- **Connected to**: `StudentDashboard` (cancel reservation button)

---

## Users

### `GET /api/users`
List all users. Requires admin authentication.
- **Response**: `User[]`
- **Connected to**: `UsersPanel` (user table + role stats)

### `GET /api/users/me`
Get the currently authenticated user's profile.
- **Response**: `User`
- **Connected to**: `StudentDashboard` (header), `LibrarianPage` (portal header)

### `POST /api/users`
Create a new user account. Requires admin authentication.
- **Request**: `{ name: string, email: string, role: UserRole }`
- **Response**: `User`
- **Connected to**: `AddUserForm`

### `PUT /api/users/:id`
Update a user's details. Requires admin authentication.
- **Request**: `{ name?, email?, role? }`
- **Response**: `User`
- **Connected to**: `UsersPanel` (inline edit)

### `DELETE /api/users/:id`
Remove a user account. Requires admin authentication.
- **Response**: `204 No Content`
- **Connected to**: `UsersPanel` (delete button)

---

## Dashboard / Stats

### `GET /api/stats`
Get aggregated statistics for the staff dashboard.
- **Response**: `{ totalBooks, availableBooks, borrowedBooks, activeLoans, overdueLoans, pendingReservations, totalUsers }`
- **Connected to**: `DashboardCards`

---

## Data Types Reference

```typescript
type Book = {
  id: string;
  title: string;
  author: string;
  category: "Computer Science" | "Software Engineering";
  status: "Available" | "Borrowed";
  location: string;
  isbn: string;
  year: number;
  description: string;
  coverUrl?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Teacher" | "Librarian" | "Admin";
};

type Loan = {
  id: string;
  studentId: string;
  isbn: string;
  bookTitle: string;
  loanDate: string;
  returnDateExpected: string;
  returnDateActual: string | null;
  status: "Active" | "Returned" | "Overdue";
};

type Reservation = {
  id: string;
  studentId: string;
  isbn: string;
  bookTitle: string;
  date: string;
  queuePosition: number;
  status: "Pending" | "Ready" | "Cancelled";
};
```
