#!/bin/bash

# API Testing Guide - cURL Commands
# Base URL: http://localhost:5000/api

echo "======================================"
echo "BU Management System - API Test Suite"
echo "======================================"

# Default values (change as needed)
BASE_URL="http://localhost:5000/api"
STUDENT_EMAIL="student@test.com"
STAFF_EMAIL="librarian@test.com"
PASSWORD="test123"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Note: Update email/password variables in this script as needed${NC}\n"

# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

echo -e "${GREEN}=== AUTHENTICATION ===${NC}\n"

echo "1. Student Login"
curl -X POST "$BASE_URL/auth/student/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$STUDENT_EMAIL'",
    "password": "'$PASSWORD'"
  }' | jq .
echo -e "\n"

echo "2. Staff Login"
curl -X POST "$BASE_URL/auth/staff/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$STAFF_EMAIL'",
    "password": "'$PASSWORD'"
  }' | jq .
echo -e "\n"

echo "3. Logout"
curl -X POST "$BASE_URL/auth/logout" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "4. Get Current User"
curl -X GET "$BASE_URL/users/me" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

# ============================================
# BOOKS ENDPOINTS
# ============================================

echo -e "${GREEN}=== BOOKS ===${NC}\n"

echo "1. Get All Books"
curl -X GET "$BASE_URL/books" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "2. Get Books with Search Filter"
curl -X GET "$BASE_URL/books?q=python" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "3. Get Books by Category"
curl -X GET "$BASE_URL/books?category=Computer%20Science" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "4. Get Available Books Only"
curl -X GET "$BASE_URL/books?status=Available" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "5. Get Single Book (replace BOOK_ISBN with actual ISBN)"
BOOK_ISBN="978-0-123456-78-9"
curl -X GET "$BASE_URL/books/$BOOK_ISBN" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "6. Get Book Recommendations"
curl -X GET "$BASE_URL/books/$BOOK_ISBN/recommendations" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "7. Create New Book (Staff)"
curl -X POST "$BASE_URL/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learning JavaScript",
    "author": "Kyle Simpson",
    "isbn": "978-1-491-95204-9",
    "year": 2023,
    "category": "Computer Science",
    "location": "Shelf A1",
    "description": "You Don'\''t Know JS Yet"
  }' | jq .
echo -e "\n"

echo "8. Update Book (Staff)"
curl -X PUT "$BASE_URL/books/$BOOK_ISBN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Available",
    "location": "Shelf B2",
    "category": "Software Engineering"
  }' | jq .
echo -e "\n"

echo "9. Delete Book (Admin)"
curl -X DELETE "$BASE_URL/books/$BOOK_ISBN" \
  -H "Content-Type: application/json"
echo -e "\n"

# ============================================
# LOANS ENDPOINTS
# ============================================

echo -e "${GREEN}=== LOANS ===${NC}\n"

echo "1. Get All Loans"
curl -X GET "$BASE_URL/loans" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "2. Get Loans for Specific Student (replace STUDENT_ID)"
STUDENT_ID="550e8400-e29b-41d4-a716-446655440000"
curl -X GET "$BASE_URL/loans?studentId=$STUDENT_ID" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "3. Get Active Loans Only"
curl -X GET "$BASE_URL/loans?status=Active" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "4. Get Overdue Loans"
curl -X GET "$BASE_URL/loans?status=Overdue" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "5. Create New Loan (Staff)"
curl -X POST "$BASE_URL/loans" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "'$STUDENT_ID'",
    "isbn": "'$BOOK_ISBN'",
    "returnDateExpected": "2024-12-31"
  }' | jq .
echo -e "\n"

echo "6. Return Book (Staff) - replace LOAN_ID"
LOAN_ID="660e8400-e29b-41d4-a716-446655440001"
curl -X PUT "$BASE_URL/loans/$LOAN_ID/return" \
  -H "Content-Type: application/json" \
  -d '{
    "returnDateActual": "2024-12-20"
  }' | jq .
echo -e "\n"

# ============================================
# RESERVATIONS ENDPOINTS
# ============================================

echo -e "${GREEN}=== RESERVATIONS ===${NC}\n"

echo "1. Get All Reservations"
curl -X GET "$BASE_URL/reservations" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "2. Get Reservations for Student"
curl -X GET "$BASE_URL/reservations?studentId=$STUDENT_ID" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "3. Get Pending Reservations"
curl -X GET "$BASE_URL/reservations?status=Pending" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "4. Get Ready Reservations"
curl -X GET "$BASE_URL/reservations?status=Ready" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "5. Create New Reservation"
curl -X POST "$BASE_URL/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "'$STUDENT_ID'",
    "isbn": "'$BOOK_ISBN'"
  }' | jq .
echo -e "\n"

echo "6. Update Reservation Status (Staff) - replace RESERVATION_ID"
RESERVATION_ID="770e8400-e29b-41d4-a716-446655440002"
curl -X PUT "$BASE_URL/reservations/$RESERVATION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Ready"
  }' | jq .
echo -e "\n"

echo "7. Cancel Reservation"
curl -X DELETE "$BASE_URL/reservations/$RESERVATION_ID" \
  -H "Content-Type: application/json"
echo -e "\n"

# ============================================
# USERS ENDPOINTS
# ============================================

echo -e "${GREEN}=== USERS ===${NC}\n"

echo "1. Get All Users (Admin)"
curl -X GET "$BASE_URL/users" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "2. Get Current User Profile"
curl -X GET "$BASE_URL/users/me" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo "3. Create New User (Admin)"
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "Student"
  }' | jq .
echo -e "\n"

echo "4. Update User (Admin) - replace USER_ID"
USER_ID="880e8400-e29b-41d4-a716-446655440003"
curl -X PUT "$BASE_URL/users/$USER_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane.smith@university.edu",
    "role": "Teacher"
  }' | jq .
echo -e "\n"

echo "5. Delete User (Admin)"
curl -X DELETE "$BASE_URL/users/$USER_ID" \
  -H "Content-Type: application/json"
echo -e "\n"

# ============================================
# STATISTICS ENDPOINTS
# ============================================

echo -e "${GREEN}=== STATISTICS ===${NC}\n"

echo "1. Get Dashboard Statistics"
curl -X GET "$BASE_URL/stats" \
  -H "Content-Type: application/json" | jq .
echo -e "\n"

echo -e "${GREEN}====== TEST SUITE COMPLETE ======${NC}"
