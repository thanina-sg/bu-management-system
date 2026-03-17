import { loans as loansAPI, users as usersAPI, books as booksAPI } from "../../lib/api";
import { useState } from "react";
import { FormResultBanner } from "./FormResultBanner";
import type { FormResult } from "./types";

export function ReturnForm() {
  const [studentId, setStudentId] = useState("");
  const [isbn, setIsbn] = useState("");
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
      const student = users.find((u) => u.id === studentId.trim());
      if (!student) {
        setResult({ type: "error", message: `Student not found: "${studentId}". Please verify the Student ID.` });
        return;
      }

      // Fetch books and validate book exists
      const books = await booksAPI.getAll();
      const book = books.find((b) => b.isbn === isbn.trim());
      if (!book) {
        setResult({ type: "error", message: `Book not found: ISBN "${isbn}" does not match any resource in the catalog.` });
        return;
      }

      // Fetch loans to find active loan
      const loans = await loansAPI.getAll();
      const loan = loans.find(
        (l) => l.id_utilisateur === studentId.trim() && 
               l.isbn === isbn.trim() && 
               !l.date_retour_reelle
      );
      if (!loan) {
        setResult({ type: "error", message: `No active loan found for student "${studentId}" with ISBN "${isbn}".` });
        return;
      }

      // Record the return
      const today = new Date().toISOString().split('T')[0];
      const studentName = `${student.nom} ${student.prenom}`;
      const bookTitle = book.title || book.titre;
      const isLate = today > loan.date_retour_prevue;
      const daysLate = isLate
        ? Math.ceil((new Date(today).getTime() - new Date(loan.date_retour_prevue).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // TODO: Update loan with return date via API
      const details: Record<string, string> = {
        "Student": `${studentName} (${studentId})`,
        "Book": bookTitle,
        "ISBN": book.isbn,
        "Loan Date": loan.date_emprunt,
        "Expected Return": loan.date_retour_prevue,
        "Actual Return": today,
        "Status": "Returned",
      };
      if (isLate) details["Late"] = `${daysLate} day(s) overdue`;

      setResult({
        type: "success",
        title: isLate ? "Return Registered (Late)" : "Return Registered Successfully",
        details,
      });
    } catch (error) {
      setResult({ type: "error", message: `Error processing return: ${error instanceof Error ? error.message : "Unknown error"}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-xl border border-ink-100 border-t-4 border-t-brand-700 bg-white p-6 text-left shadow-soft">
        <div className="font-serif text-3xl text-ink-900 md:text-5xl">Book Return</div>
        <p className="mt-2 text-base text-ink-500 md:text-2xl">
          Enter student and resource details to register return.
        </p>

        <div className="mt-5 rounded-lg border border-ink-100 bg-surface-50 p-4">
          <div>
            <label className="mb-2 block text-base font-semibold text-ink-900">&#x25CE; Student ID</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. S-100234"
              className="w-full rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-lg text-ink-900 outline-none focus:border-brand-500 md:text-3xl" />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-base font-semibold text-ink-900">&#x25A1; Book ISBN</label>
            <input value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="e.g. 978-0262033848"
              className="w-full rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-lg text-ink-900 outline-none focus:border-brand-500 md:text-3xl" />
          </div>
        </div>

        <FormResultBanner result={result} />

        <button type="button" onClick={handleValidate} disabled={isLoading}
          className="mt-8 w-full rounded-lg bg-brand-700 px-4 py-4 text-xl font-semibold text-white shadow-soft hover:bg-brand-600 disabled:bg-ink-300 md:text-4xl">
          {isLoading ? "Processing..." : "Validate Return"}
        </button>
      </div>
    </div>
  );
}
