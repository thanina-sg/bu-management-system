# System Architecture & Data Flow Diagrams

## 1️⃣ Overall System Architecture

```
╔═══════════════════════════════════════════════════════════════════╗
║                   USER BROWSER (Frontend)                        ║
║                  http://localhost:5173                           ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │  React Application                                          │ ║
║  │  ├─ Pages: Home, Details, Librarian                        │ ║
║  │  ├─ Components: Dashboard, Login, Modals                   │ ║
║  │  └─ State: User, Books, Loans, Reservations               │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
║              ↓ All requests have Bearer token ↓                  ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │  API Service Layer (src/lib/api.ts)                        │ ║
║  │  ├─ auth: login, logout, getCurrentUser                   │ ║
║  │  ├─ books: getAll, getById, getRecommendations            │ ║
║  │  ├─ loans: getAll, create, return                         │ ║
║  │  ├─ reservations: getAll, create, update, delete          │ ║
║  │  ├─ users: getAll, getCurrent, create, update, delete     │ ║
║  │  └─ stats: get                                            │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
║              ↓ HTTP Fetch with Headers ↓                         ║
╚═══════════════════════════════════════════════════════════════════╝
                    ↓ HTTPS/HTTP ↓
╔═══════════════════════════════════════════════════════════════════╗
║              BACKEND SERVER (Express.js)                         ║
║              http://localhost:5000                               ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │  Express Routes                                            │ ║
║  │  ├─ /api/auth/* → authController                          │ ║
║  │  ├─ /api/books/* → bookController                         │ ║
║  │  ├─ /api/loans/* → empruntController                      │ ║
║  │  ├─ /api/reservations/* → reservationController           │ ║
║  │  ├─ /api/users/* → userController                         │ ║
║  │  └─ /api/stats/* → statsController                        │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
║              ↓ ↓ ↓                                                ║
║  ┌─────────────────────────────────────────────────────────────┐ ║
║  │  Model Layer (Business Logic)                              │ ║
║  │  ├─ authModel: registerUser, loginStudent                 │ ║
║  │  ├─ bookModel: database queries for books                 │ ║
║  │  ├─ empruntModel: loan operations with auto-penalties     │ ║
║  │  ├─ reservationModel: queue management                    │ ║
║  │  └─ userModel: user management                            │ ║
║  └─────────────────────────────────────────────────────────────┘ ║
║              ↓ Supabase Client ↓                                 ║
╚═══════════════════════════════════════════════════════════════════╝
                    ↓ HTTPS ↓
╔═══════════════════════════════════════════════════════════════════╗
║  PostgreSQL Database (Supabase)                                  ║
║  ├─ utilisateur (users)                                          ║
║  ├─ livre (books)                                                ║
║  ├─ exemplaire (book copies)                                     ║
║  ├─ emprunt (loans)                                              ║
║  ├─ reservation (reservations)                                   ║
║  ├─ penalite (penalties)                                         ║
║  └─ livre_similitude (recommendations)                           ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 2️⃣ User Authentication Flow

```
START
  ↓
User clicks Account Icon
  ↓
┌────────────────────────────────────┐
│ Is token in localStorage?          │
└────────────────────────────────────┘
  ↓                            ↓
 YES                           NO
  ↓                            ↓
Show Dashboard        Show Login Form
  ↓                            ↓
fetch loans,          User enters:
reservations,         - Email
books                 - Password
  ↓                            ↓
                    User clicks "Sign In"
                            ↓
                    POST /api/auth/student/login
                            ↓
                    ┌─────────────────────┐
                    │ Backend validates   │
                    │ credentials         │
                    └─────────────────────┘
                            ↓
                    ┌─────────────────────┐
                    │ Valid? ────NO──→ Show Error
                    └─────────────────────┘
                          YES
                            ↓
                    Generate JWT Token
                            ↓
                    Return { user, token }
                            ↓
                    Frontend stores:
                    - localStorage.authToken = token
                    - localStorage.user = user
                            ↓
                    Show StudentDashboard
                            ↓
                    fetch loans, reservations, books
                    (with Authorization header)
                            ↓
                    Display real data
                            ↓
                    END ✅
```

---

## 3️⃣ Book Browsing Flow

```
User visits http://localhost:5173
          ↓
    HomePage loads
          ↓
    useEffect triggers
          ↓
    GET /api/books
          ↓
    ┌──────────────────────┐
    │ Books loaded?        │
    └──────────────────────┘
      ↓            ↓
     YES          NO
      ↓            ↓
  Render      Show loading...
  books         ↓
   grid      Show error
      ↓
 User types
 in search
      ↓
applyFilters()
(client-side)
      ↓
Update filtered
   results
      ↓
User clicks
"View Details"
      ↓
Navigate to
/book/:isbn
      ↓
DetailsPage loads
      ↓
useEffect triggers
      ↓
GET /api/books/:isbn
GET /api/books/:isbn/recommendations
(parallel)
      ↓
Display book details
with recommendations
      ↓
User clicks
"Reserve" or "Borrow"
      ↓
[See Reservation Flow]
```

---

## 4️⃣ Reservation Flow

```
User on DetailsPage
(Borrowed book)
      ↓
Click "Reserve Resource"
      ↓
ReservationModal opens
      ↓
User clicks "Confirm"
      ↓
POST /api/reservations
{
  studentId: "S-100001",
  isbn: "978-0-123456-78-9"
}
      ↓
┌─────────────────────────┐
│ Backend checks:         │
│ - User exists?          │
│ - Book exists?          │
│ - Not already reserved? │
└─────────────────────────┘
      ↓
Calculate queue position
(count existing reservations)
      ↓
Insert into DB
      ↓
Return reservation
with queuePosition
      ↓
Frontend shows:
"You are #5 in queue"
      ↓
Modal closes
      ↓
User sees reservation
in dashboard
      ↓
Can click "Cancel" to:
PUT /api/reservations/:id
{"status": "Cancelled"}
      ↓
Removed from queue
```

---

## 5️⃣ Token & Authorization Flow

```
User logs in successfully
         ↓
Receive JWT token:
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
         ↓
Store in localStorage
         ↓
┌──────────────────────────────────────┐
│ All subsequent API requests:         │
│ fetch(url, {                         │
│   headers: {                         │
│     Authorization: "Bearer {token}"  │
│   }                                  │
│ })                                   │
└──────────────────────────────────────┘
         ↓
Backend middleware checks:
jwt.verify(token, JWT_SECRET)
         ↓
┌────────────────────┐
│ Valid token?       │
└────────────────────┘
   YES ↓           ↓ NO
      ↓            ↓
  Continue      Return 401
  request     Unauthorized
      ↓            ↓
  Extract       Frontend:
  user ID    removes token
      ↓       & re-shows
  Attach to   login form
  request
      ↓
  Execute
  business
  logic
      ↓
  Return
  user data
  (with     } 24 hour
  user ID   } expiry
  attached) }
      ↓
Future login required
after expiration
```

---

## 6️⃣ Component State Management

```
┌─────────────────────────────────────────────────────────┐
│          AccountPanel (Parent)                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ State:                                            │  │
│  │ - loggedInUser: User | null                      │  │
│  │ - isCheckingAuth: boolean                        │  │
│  │                                                   │  │
│  │ useEffect: Check localStorage for stored user   │  │
│  └───────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Conditional Render:                              │  │
│  │ - Loading: "Checking auth..."                   │  │
│  │ - No user: → StudentLoginView                   │  │
│  │ - Has user: → StudentDashboard                  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ↓                          ↓
┌───────────────────┐    ┌──────────────────────┐
│StudentLoginView   │    │StudentDashboard      │
├───────────────────┤    ├──────────────────────┤
│State:             │    │State:               │
│- email            │    │- userLoans[]        │
│- password         │    │- userReservations[] │
│- error            │    │- books Map          │
│- isLoading        │    │- isLoading          │
│                   │    │- error              │
│onSubmit:          │    │                     │
│auth.loginStudent()│    │useEffect on mount:  │
│ ↓                 │    │- getLoans()         │
│ Sets token in     │    │- getReservations()  │
│ localStorage      │    │- getBooks()         │
│ ↓                 │    │                     │
│ Calls onLogin()   │    │Render: Tabs+Lists   │
│ (parent)          │    │- Loans              │
│                   │    │- Reservations       │
│                   │    │                     │
│                   │    │onClick cancel:      │
│                   │    │reservations.update()│
└───────────────────┘    └──────────────────────┘
```

---

## 7️⃣ Data Fetching Pattern (useEffect)

```
Component mounts
         ↓
useEffect fires
         ↓
┌──────────────────────────────┐
│ setIsLoading(true)           │
│ setError(null)               │
└──────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│ Try: fetch data from API             │
│ - const data = await api.getAll()    │
│ - setData(data)                      │
└──────────────────────────────────────┘
         ↓
    ┌────────────┐
    │ Success?   │
    └────────────┘
       YES ↓         ↓ NO
          ↓         ↓
      Continue   console.error()
          ↓       setError(msg)
      ┌──────────────────────┐
      │ Finally:             │
      │ setIsLoading(false)  │
      └──────────────────────┘
              ↓
      Component renders:
      - if (isLoading): <Loading/>
      - if (error): <Error/>
      - if (data): <Content/>
```

---

## 8️⃣ Error Handling Chain

```
Browser (Frontend)
    ↓ fetch() call
    ↓
API Service (api.ts)
    ↓
fetchAPI wrapper catches:
- Network errors → throw APIError
- 4xx/5xx response → throw APIError
- Invalid JSON → throw APIError
    ↓
Component (try/catch)
    ↓
┌──────────────────────────┐
│ if (err instanceof       │
│    APIError) {           │
│  show err.message        │
│}                        │
└──────────────────────────┘
    ↓
User sees:
"Failed to load books"
or specific error
    ↓
User can retry/refresh
```

---

## 9️⃣ localStorage Structure

```
Browser LocalStorage
┌─────────────────────────────────────┐
│ Key: authToken                      │
│ Value: "eyJhbGciOiJIUzI1NiIs..."   │
│ Type: JWT (24 hour expiry)          │
└─────────────────────────────────────┘
         ↓
    Used by:
    - auth.getToken()
    - API service (Authorization header)
    - Auto-logout on 401
         ↓
┌─────────────────────────────────────┐
│ Key: user                           │
│ Value: {                            │
│   "id": "S-100001",                │
│   "name": "Alice Dupont",          │
│   "email": "alice@uha.fr",         │
│   "role": "Student"                │
│ }                                   │
└─────────────────────────────────────┘
         ↓
    Used by:
    - auth.getStoredUser()
    - StudentDashboard initialization
    - ReservationModal (get studentId)
         ↓
On logout:
- localStorage.removeItem('authToken')
- localStorage.removeItem('user')
```

---

## 🔟 Request/Response Flow Example

```
FRONTEND REQUEST:
┌──────────────────────────────────────────────┐
│ fetch('http://localhost:5000/api/loans', {  │
│   method: 'GET',                            │
│   headers: {                                │
│     'Authorization': 'Bearer TOKEN...',     │
│     'Content-Type': 'application/json'      │
│   }                                          │
│ })                                          │
└──────────────────────────────────────────────┘
         ↓
BACKEND PROCESSING:
┌──────────────────────────────────────────────┐
│ 1. CORS middleware: Check origin ✓          │
│ 2. JWT middleware: Verify token ✓           │
│ 3. Route handler: GET /api/loans            │
│ 4. empruntController.getLoans()             │
│ 5. empruntModel.getLoans(userId)            │
│ 6. Supabase: Query DB                       │
│ 7. Transform data                           │
│ 8. Return response                          │
└──────────────────────────────────────────────┘
         ↓
BACKEND RESPONSE:
┌──────────────────────────────────────────────┐
│ {                                           │
│   "status": 200,                            │
│   "body": [                                 │
│     {                                       │
│       "id": "L-001",                       │
│       "studentId": "S-100001",             │
│       "isbn": "978-...",                   │
│       "bookTitle": "Harry Potter",         │
│       "loanDate": "2024-03-01",            │
│       "returnDateExpected": "2024-03-15",  │
│       "returnDateActual": null,            │
│       "status": "Active"                   │
│     },                                      │
│     ...                                    │
│   ]                                        │
│ }                                          │
└──────────────────────────────────────────────┘
         ↓
FRONTEND PROCESSING:
┌──────────────────────────────────────────────┐
│ 1. Check response.ok (200-299) ✓            │
│ 2. response.json()                          │
│ 3. Return types to component                │
│ 4. setUserLoans(data)                       │
│ 5. Component re-renders                     │
│ 6. Loans displayed in UI                    │
└──────────────────────────────────────────────┘
```

---

## Dependency Chain

```
Frontend Request
    ↓
1. Component (useState, useEffect)
    ↓
2. API Service (api.ts - typed interface)
    ↓
3. Fetch wrapper (token injection, error handling)
    ↓
4. HTTP Network
    ↓
5. Backend Express (routing)
    ↓
6. Controllers (request handling)
    ↓
7. Models (business logic, validation)
    ↓
8. Supabase Client
    ↓
9. PostgreSQL Database
    ↓
10. Data returns (reverse chain)
```

---

These diagrams show:
- System architecture and components
- User authentication flow
- Data fetching patterns
- Error handling
- State management
- Request/response lifecycle
- LocalStorage usage
- Dependency chain

Use these as reference when debugging or understanding the system! 🎯
