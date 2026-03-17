import { useState } from "react";
import { users as usersAPI, books as booksAPI, type User, type Book } from "../../lib/api";
import { FormResultBanner } from "./FormResultBanner";
import type { FormResult } from "./types";

export function LoanForm() {
  const [studentId, setStudentId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [loanDate, setLoanDate] = useState("2026-03-17");
  const [returnDate, setReturnDate] = useState("2026-03-31");
  const [result, setResult] = useState<FormResult>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    setResult(null);
    setIsLoading(true);

    try {
      if (!studentId.trim() || !isbn.trim()) {
        setResult({ type: "error", message: "Please fill in all required fields." });
        return;
      }

      // Fetch user and validate student exists
      const users = await usersAPI.getAll();
      const student: User | undefined = users.find((s: User) => s.id === studentId.trim());
      if (!student) {
        setResult({ type: "error", message: `Student not found: "${studentId}". Please verify the Student ID.` });
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
          "Student": `${studentName} (${studentId})`,
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
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-xl border border-ink-100 border-t-4 border-t-brand-700 bg-white p-6 text-left shadow-soft">
        <div className="font-serif text-3xl text-ink-900 md:text-5xl">New Loan Registration</div>
        <p className="mt-2 text-base text-ink-500 md:text-2xl">
          Enter student and resource details to authorize loan.
        </p>

        <div className="mt-5 rounded-lg border border-ink-100 bg-surface-50 p-4">
          <div>
            <label className="mb-2 block text-base font-semibold text-ink-900">&#x25CE; Student ID</label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. S-100234"
              className="w-full rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-lg text-ink-900 outline-none focus:border-brand-500 md:text-3xl"
            />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-base font-semibold text-ink-900">&#x25A1; Book ISBN</label>
            <input
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 978-0201896831"
              className="w-full rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-lg text-ink-900 outline-none focus:border-brand-500 md:text-3xl"
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-base font-semibold text-ink-900">&#x25F7; Loan Date</label>
            <input type="date" value={loanDate} onChange={(e) => setLoanDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2.5 text-lg text-ink-900 outline-none focus:border-brand-500 md:text-3xl" />
          </div>
          <div>
            <label className="mb-2 block text-base font-semibold text-ink-900">&#x25F7; Return Date</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2.5 text-lg text-ink-900 outline-none focus:border-brand-500 md:text-3xl" />
          </div>
        </div>

        <FormResultBanner result={result} />

        <button type="button" onClick={handleValidate} disabled={isLoading}
          className="mt-8 w-full rounded-lg bg-brand-700 px-4 py-4 text-xl font-semibold text-white shadow-soft hover:bg-brand-600 disabled:bg-ink-300 md:text-4xl">
          {isLoading ? "Validating..." : "Validate Loan"}
        </button>
      </div>
    </div>
  );
}
