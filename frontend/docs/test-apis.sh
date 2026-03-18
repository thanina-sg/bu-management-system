#!/bin/bash

BASE_URL="http://localhost:5000"
STUDENT_ID="7b639022-6314-475e-b3c9-0eaaf18c3224"
ISBN="978-2070413119"

echo "=== TESTING ALL APIS ==="
echo ""

# Test 1: GET /api/books
echo "1. GET /api/books"
curl -s "$BASE_URL/api/books" | python3 -m json.tool | head -5
echo ""

# Test 2: GET /api/books/:id
echo "2. GET /api/books/$ISBN"
curl -s "$BASE_URL/api/books/$ISBN" | python3 -m json.tool 2>/dev/null || echo "FAILED"
echo ""

# Test 3: GET /api/loans
echo "3. GET /api/loans"
curl -s "$BASE_URL/api/loans" | python3 -m json.tool | head -5
echo ""

# Test 4: GET /api/loans (with filter)
echo "4. GET /api/loans?studentId=$STUDENT_ID"
curl -s "$BASE_URL/api/loans?studentId=$STUDENT_ID" | python3 -m json.tool | head -5
echo ""

# Test 5: GET /api/reservations
echo "5. GET /api/reservations"
curl -s "$BASE_URL/api/reservations" | python3 -m json.tool | head -5
echo ""

# Test 6: GET /api/users
echo "6. GET /api/users"
curl -s "$BASE_URL/api/users" 2>&1 | head -20
echo ""

# Test 7: GET /api/users/me
echo "7. GET /api/users/me"
curl -s "$BASE_URL/api/users/me" 2>&1 | head -20
echo ""

# Test 8: GET /api/stats
echo "8. GET /api/stats"
curl -s "$BASE_URL/api/stats" | python3 -m json.tool
echo ""

# Test 9: GET /api/auth/me
echo "9. GET /api/auth/me"
curl -s "$BASE_URL/api/auth/me" 2>&1 | head -20
echo ""

# Test 10: POST /api/auth/student/login
echo "10. POST /api/auth/student/login (no token test)"
curl -s -X POST "$BASE_URL/api/auth/student/login" -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}' | python3 -m json.tool
echo ""

# Test 11: GET /api/ai/query
echo "11. GET /api/ai/query (should be POST)"
curl -s "$BASE_URL/api/ai/query" 2>&1 | head -20
echo ""

# Test 12: POST /api/ai/query
echo "12. POST /api/ai/query"
curl -s -X POST "$BASE_URL/api/ai/query" -H "Content-Type: application/json" -d '{"question":"what books do you have"}' | python3 -m json.tool
echo ""

echo "=== TEST SUMMARY ==="
