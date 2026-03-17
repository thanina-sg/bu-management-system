# Quick cURL Test Commands

## Setup
```bash
BASE_URL="http://localhost:5000/api"
STUDENT_ID="550e8400-e29b-41d4-a716-446655440000"  # Replace with real UUID
BOOK_ISBN="978-0-123456-78-9"  # Replace with real ISBN
LOAN_ID="660e8400-e29b-41d4-a716-446655440001"  # Replace with real UUID
RESERVATION_ID="770e8400-e29b-41d4-a716-446655440002"  # Replace with real UUID
USER_ID="880e8400-e29b-41d4-a716-446655440003"  # Replace with real UUID
```

---

## AUTHENTICATION

### Login as Student
```bash
curl -X POST "http://localhost:5000/api/auth/student/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"test123"}'
```

### Login as Staff
```bash
curl -X POST "http://localhost:5000/api/auth/staff/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"librarian@test.com","password":"test123"}'
```

### Logout
```bash
curl -X POST "http://localhost:5000/api/auth/logout" \
  -H "Content-Type: application/json"
```

### Get Current User
```bash
curl -X GET "http://localhost:5000/api/users/me" \
  -H "Content-Type: application/json"
```

---

## BOOKS

### Get All Books
```bash
curl "http://localhost:5000/api/books"
```

### Search Books
```bash
curl "http://localhost:5000/api/books?q=python"
```

### Filter by Category
```bash
curl "http://localhost:5000/api/books?category=Computer%20Science"
```

### Filter by Status
```bash
curl "http://localhost:5000/api/books?status=Available"
```

### Get Single Book
```bash
curl "http://localhost:5000/api/books/$BOOK_ISBN"
```

### Get Recommendations
```bash
curl "http://localhost:5000/api/books/$BOOK_ISBN/recommendations"
```

### Create Book
```bash
curl -X POST "http://localhost:5000/api/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Learning JavaScript",
    "author":"Kyle Simpson",
    "isbn":"978-1-491-95204-9",
    "year":2023,
    "category":"Computer Science",
    "location":"Shelf A1",
    "description":"Programming guide"
  }'
```

### Update Book
```bash
curl -X PUT "http://localhost:5000/api/books/$BOOK_ISBN" \
  -H "Content-Type: application/json" \
  -d '{
    "status":"Available",
    "location":"Shelf B2",
    "category":"Software Engineering"
  }'
```

### Delete Book
```bash
curl -X DELETE "http://localhost:5000/api/books/$BOOK_ISBN"
```

---

## LOANS

### Get All Loans
```bash
curl "http://localhost:5000/api/loans"
```

### Get Loans for Student
```bash
curl "http://localhost:5000/api/loans?studentId=$STUDENT_ID"
```

### Get Active Loans
```bash
curl "http://localhost:5000/api/loans?status=Active"
```

### Get Returned Loans
```bash
curl "http://localhost:5000/api/loans?status=Returned"
```

### Get Overdue Loans
```bash
curl "http://localhost:5000/api/loans?status=Overdue"
```

### Create Loan
```bash
curl -X POST "http://localhost:5000/api/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":"'$STUDENT_ID'",
    "isbn":"'$BOOK_ISBN'",
    "returnDateExpected":"2024-12-31"
  }'
```

### Return Book
```bash
curl -X PUT "http://localhost:5000/api/loans/$LOAN_ID/return" \
  -H "Content-Type: application/json" \
  -d '{"returnDateActual":"2024-12-20"}'
```

---

## RESERVATIONS

### Get All Reservations
```bash
curl "http://localhost:5000/api/reservations"
```

### Get Student Reservations
```bash
curl "http://localhost:5000/api/reservations?studentId=$STUDENT_ID"
```

### Get Pending Reservations
```bash
curl "http://localhost:5000/api/reservations?status=Pending"
```

### Get Ready Reservations
```bash
curl "http://localhost:5000/api/reservations?status=Ready"
```

### Create Reservation
```bash
curl -X POST "http://localhost:5000/api/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId":"'$STUDENT_ID'",
    "isbn":"'$BOOK_ISBN'"
  }'
```

### Update Reservation Status
```bash
curl -X PUT "http://localhost:5000/api/reservations/$RESERVATION_ID" \
  -H "Content-Type: application/json" \
  -d '{"status":"Ready"}'
```

### Cancel Reservation
```bash
curl -X DELETE "http://localhost:5000/api/reservations/$RESERVATION_ID"
```

---

## USERS

### Get All Users
```bash
curl "http://localhost:5000/api/users"
```

### Get Current User
```bash
curl "http://localhost:5000/api/users/me"
```

### Create User
```bash
curl -X POST "http://localhost:5000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john.doe@university.edu",
    "role":"Student"
  }'
```

### Update User
```bash
curl -X PUT "http://localhost:5000/api/users/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Jane Smith",
    "email":"jane.smith@university.edu",
    "role":"Teacher"
  }'
```

### Delete User
```bash
curl -X DELETE "http://localhost:5000/api/users/$USER_ID"
```

---

## STATISTICS

### Get Dashboard Stats
```bash
curl "http://localhost:5000/api/stats"
```

---

## Tips

- Use `| jq .` to format JSON output: `curl "..." | jq .`
- For pretty-printed JSON: `curl -s "..." | jq .`
- Store response to variable: `RESPONSE=$(curl -s "...")`
- Extract specific field: `curl -s "..." | jq '.user.name'`
- Test with token from login:
  ```bash
  TOKEN=$(curl -s -X POST "..." | jq -r '.token')
  curl -H "Authorization: Bearer $TOKEN" "..."
  ```

