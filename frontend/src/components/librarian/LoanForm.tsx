import { useState, useEffect } from "react";
import { users as usersAPI, books as booksAPI, type User, type Book } from "../../lib/api";
import { FormResultBanner } from "./FormResultBanner";
import type { FormResult } from "./types";

export function LoanForm() {
  const [userSearch, setUserSearch] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [loanDate, setLoanDate] = useState("2026-03-17");
  const [returnDate, setReturnDate] = useState("2026-03-31");
  const [result, setResult] = useState<FormResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await usersAPI.getAll();
        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search input
  useEffect(() => {
    if (userSearch.trim() === "") {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const search = userSearch.toLowerCase();
    const filtered = allUsers.filter(u =>
      u.email.toLowerCase().includes(search) ||
      `${u.prenom} ${u.nom}`.toLowerCase().includes(search) ||
      `${u.nom} ${u.prenom}`.toLowerCase().includes(search)
    );
    setFilteredUsers(filtered);
    setShowDropdown(true);
  }, [userSearch, allUsers]);

  const handleValidate = async () => {
    setResult(null);
    setIsLoading(true);

    try {
      if (!selectedUserId.trim() || !isbn.trim()) {
        setResult({ type: "error", message: "Please select a student/user and enter an ISBN." });
        return;
      }

      // Get selected student
      const student = allUsers.find(u => u.id === selectedUserId);
      if (!student) {
        setResult({ type: "error", message: "Student not found." });
        return;
      }

      // Fetch books and validate book exists and is available
      const books = await booksAPI.getAll();
      const book: Book | undefined = books.find((b: Book) => b.isbn === isbn.trim());
      if (!book) {
        setResult({ type: "error", message: `Book not found: ISBN "${isbn}" does not match any resource in the catalog.` });
        return;
      }

      const bookStatus = book.status || (book.disponible === false ? "Borrowed" : "Available");
      if (bookStatus === "Borrowed") {
        const bookTitle = book.title || book.titre;
        setResult({ type: "error", message: `"${bookTitle}" is currently borrowed and not available for loan.` });
        return;
      }

      const studentName = `${student.prenom || ''} ${student.nom || ''}`.trim();
      const bookTitle = book.title || book.titre;
      
      setResult({
        type: "success",
        title: "Loan Registered Successfully",
        details: {
          "Student": `${studentName} (${student.email})`,
          "Book": bookTitle,
          "ISBN": book.isbn,
          "Loan Date": loanDate,
          "Expected Return": returnDate,
          "Status": "Active",
        },
      });
    } catch (error) {
      setResult({ type: "error", message: `Error validating loan: ${error instanceof Error ? error.message : "Unknown error"}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-xl border border-ink-100 border-t-4 border-t-brand-700 bg-white p-4 text-left shadow-soft">
        <div className="font-serif text-2xl text-ink-900 md:text-4xl">New Loan Registration</div>
        <p className="mt-2 text-sm text-ink-500 md:text-base">
          Enter student and resource details to authorize loan.
        </p>

        <div className="mt-5 rounded-lg border border-ink-100 bg-surface-50 p-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25CE; Search Student/User</label>
            <div className="relative">
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onFocus={() => userSearch.trim() && setShowDropdown(true)}
                placeholder="Type email or name..."
                className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 md:text-base"
              />
              {showDropdown && filteredUsers.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-ink-100 bg-white shadow-lg">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setUserSearch(`${user.prenom} ${user.nom} (${user.email})`);
                        setShowDropdown(false);
                      }}
                      className="w-full border-b border-ink-50 px-3 py-2 text-left text-sm hover:bg-surface-50"
                    >
                      <div className="font-semibold text-ink-900">{user.prenom} {user.nom}</div>
                      <div className="text-xs text-ink-500">{user.email} • {user.role}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedUserId && (
              <div className="mt-2 rounded-lg bg-green-50 px-2 py-1.5 text-xs text-green-800">
                ✓ Selected: {userSearch}
              </div>
            )}
          </div>
          <div className="mt-3">
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25A1; Book ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 978-0201896831"
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 md:text-base"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25F7; Loan Date</label>
            <input type="date" value={loanDate} onChange={(e) => setLoanDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 md:text-base" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25F7; Return Date</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 md:text-base" />
          </div>
        </div>

        <FormResultBanner result={result} />

        <button type="button" onClick={handleValidate} disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-brand-700 px-3 py-2.5 text-base font-semibold text-white shadow-soft hover:bg-brand-600 disabled:bg-ink-300 md:text-lg">
          {isLoading ? "Validating..." : "Validate Loan"}
        </button>
      </div>
    </div>
  );
}
