export type BookStatus = "Available" | "Borrowed";
export type BookCategory = "Computer Science" | "Software Engineering";

export type Book = {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  status: BookStatus;
  location: string;
  isbn: string;
  year: number;
  description: string;
  coverUrl?: string;
};

export type UserRole = "Student" | "Teacher" | "Librarian" | "Admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type StaffAccount = {
  email: string;
  password: string;
  userId: string;
  role: "Librarian" | "Admin";
};

export type StudentAccount = {
  email: string;
  password: string;
  userId: string;
};

export type Loan = {
  id: string;
  studentId: string;
  isbn: string;
  bookTitle: string;
  loanDate: string;
  returnDateExpected: string;
  returnDateActual: string | null;
  status: "Active" | "Returned" | "Overdue";
};

export type Reservation = {
  id: string;
  studentId: string;
  isbn: string;
  bookTitle: string;
  date: string;
  queuePosition: number;
  status: "Pending" | "Ready" | "Cancelled";
};

export const USERS: User[] = [
  { id: "S-100234", name: "Alice Dupont", email: "alice.dupont@uha.fr", role: "Student" },
  { id: "S-100412", name: "Marc Leroy", email: "marc.leroy@uha.fr", role: "Student" },
  { id: "S-100589", name: "Fatima Bensaid", email: "fatima.bensaid@uha.fr", role: "Student" },
  { id: "T-200101", name: "Prof. Jean Muller", email: "jean.muller@uha.fr", role: "Teacher" },
  { id: "LIB-001", name: "Sophie Martin", email: "sophie.martin@uha.fr", role: "Librarian" },
  { id: "LIB-002", name: "Pierre Duval", email: "pierre.duval@uha.fr", role: "Librarian" },
  { id: "ADM-001", name: "Dr. Claire Petit", email: "admin@uha.fr", role: "Admin" },
];

/** @deprecated Use USERS instead */
export const STUDENTS = USERS;

export const STUDENT_ACCOUNTS: StudentAccount[] = [
  { email: "alice.dupont@uha.fr", password: "stu123", userId: "S-100234" },
  { email: "marc.leroy@uha.fr", password: "stu123", userId: "S-100412" },
  { email: "fatima.bensaid@uha.fr", password: "stu123", userId: "S-100589" },
  { email: "jean.muller@uha.fr", password: "stu123", userId: "T-200101" },
];

export const STAFF_ACCOUNTS: StaffAccount[] = [
  { email: "sophie.martin@uha.fr", password: "lib123", userId: "LIB-001", role: "Librarian" },
  { email: "pierre.duval@uha.fr", password: "lib123", userId: "LIB-002", role: "Librarian" },
  { email: "admin@uha.fr", password: "admin123", userId: "ADM-001", role: "Admin" },
];

export const LOANS: Loan[] = [
  {
    id: "L-001",
    studentId: "S-100234",
    isbn: "978-0262033848",
    bookTitle: "Introduction to Algorithms",
    loanDate: "2026-03-01",
    returnDateExpected: "2026-03-15",
    returnDateActual: null,
    status: "Overdue",
  },
  {
    id: "L-002",
    studentId: "S-100412",
    isbn: "978-0201633610",
    bookTitle: "Design Patterns",
    loanDate: "2026-03-10",
    returnDateExpected: "2026-03-24",
    returnDateActual: null,
    status: "Active",
  },
  {
    id: "L-003",
    studentId: "S-100234",
    isbn: "978-0132350884",
    bookTitle: "Clean Code",
    loanDate: "2026-02-15",
    returnDateExpected: "2026-03-01",
    returnDateActual: "2026-02-28",
    status: "Returned",
  },
  {
    id: "L-004",
    studentId: "S-100589",
    isbn: "978-0201896831",
    bookTitle: "The Art of Computer Programming",
    loanDate: "2026-02-01",
    returnDateExpected: "2026-02-15",
    returnDateActual: "2026-02-14",
    status: "Returned",
  },
  {
    id: "L-005",
    studentId: "T-200101",
    isbn: "978-0262510875",
    bookTitle: "Structure and Interpretation of Computer Programs",
    loanDate: "2026-03-05",
    returnDateExpected: "2026-04-05",
    returnDateActual: null,
    status: "Active",
  },
];

export const RESERVATIONS: Reservation[] = [
  {
    id: "R-001",
    studentId: "S-100589",
    isbn: "978-0262033848",
    bookTitle: "Introduction to Algorithms",
    date: "2026-03-12",
    queuePosition: 1,
    status: "Pending",
  },
  {
    id: "R-002",
    studentId: "S-100234",
    isbn: "978-0201633610",
    bookTitle: "Design Patterns",
    date: "2026-03-14",
    queuePosition: 1,
    status: "Pending",
  },
  {
    id: "R-003",
    studentId: "T-200101",
    isbn: "978-0262033848",
    bookTitle: "Introduction to Algorithms",
    date: "2026-03-15",
    queuePosition: 2,
    status: "Pending",
  },
  {
    id: "R-004",
    studentId: "S-100412",
    isbn: "978-0201896831",
    bookTitle: "The Art of Computer Programming",
    date: "2026-02-20",
    queuePosition: 1,
    status: "Ready",
  },
];

export const BOOKS: Book[] = [
  {
    id: "1",
    title: "The Art of Computer Programming",
    author: "Donald E. Knuth",
    category: "Computer Science",
    status: "Available",
    location: "Main Stack",
    isbn: "978-0201896831",
    year: 1997,
    description:
      "The Art of Computer Programming (TAOCP) is a comprehensive monograph written by computer scientist Donald Knuth that covers many kinds of programming algorithms and their analysis.",
    coverUrl:
      "https://covers.openlibrary.org/b/isbn/9780201896831-L.jpg",
  },
  {
    id: "2",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category: "Computer Science",
    status: "Borrowed",
    location: "Main Stack",
    isbn: "978-0262033848",
    year: 2009,
    description:
      "A widely used textbook on algorithms, covering a broad range of topics with rigorous analysis and practical examples.",
    coverUrl:
      "https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg",
  },
  {
    id: "3",
    title: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson",
    category: "Computer Science",
    status: "Available",
    location: "Main Stack",
    isbn: "978-0262510875",
    year: 1996,
    description:
      "A classic introduction to computer science using Scheme, emphasizing fundamental principles of programming and abstraction.",
    coverUrl:
      "https://covers.openlibrary.org/b/isbn/9780262510875-L.jpg",
  },
  {
    id: "4",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    category: "Software Engineering",
    status: "Available",
    location: "Main Stack",
    isbn: "978-0132350884",
    year: 2008,
    description:
      "A practical guide to writing clean, maintainable code with principles, patterns, and case studies.",
    coverUrl:
      "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
  },
  {
    id: "5",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    category: "Software Engineering",
    status: "Borrowed",
    location: "Main Stack",
    isbn: "978-0201633610",
    year: 1994,
    description:
      "The foundational catalog of classic design patterns for object-oriented software design.",
    coverUrl:
      "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
  },
];

export const CATEGORIES: Array<"All Categories" | BookCategory> = [
  "All Categories",
  "Computer Science",
  "Software Engineering",
];

export const STATUSES: Array<"All Status" | BookStatus> = ["All Status", "Available", "Borrowed"];
