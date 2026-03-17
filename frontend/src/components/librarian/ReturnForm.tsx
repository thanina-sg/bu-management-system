import { useState } from "react";
import { BOOKS, LOANS, USERS } from "../../lib/books";
import { FormResultBanner } from "./FormResultBanner";
import type { FormResult } from "./types";

export function ReturnForm() {
  const [studentId, setStudentId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [result, setResult] = useState<FormResult>(null);

  const handleValidate = () => {
    setResult(null);

    if (!studentId.trim() || !isbn.trim()) {
      setResult({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    const student = USERS.find((s) => s.id === studentId.trim());
    if (!student) {
      setResult({ type: "error", message: `Student not found: "${studentId}". Please verify the Student ID.` });
      return;
    }

    const book = BOOKS.find((b) => b.isbn === isbn.trim());
    if (!book) {
      setResult({ type: "error", message: `Book not found: ISBN "${isbn}" does not match any resource in the catalog.` });
      return;
    }

    const loan = LOANS.find(
      (l) => l.studentId === studentId.trim() && l.isbn === isbn.trim() && l.returnDateActual === null
    );
    if (!loan) {
      setResult({ type: "error", message: `No active loan found for student "${studentId}" with ISBN "${isbn}".` });
      return;
    }

    const today = "2026-03-17";
    const isLate = today > loan.returnDateExpected;
    const daysLate = isLate
      ? Math.ceil((new Date(today).getTime() - new Date(loan.returnDateExpected).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    const details: Record<string, string> = {
      "Student": `${student.name} (${student.id})`,
      "Book": book.title,
      "ISBN": book.isbn,
      "Loan Date": loan.loanDate,
      "Expected Return": loan.returnDateExpected,
      "Actual Return": today,
      "Status": "Returned",
    };
    if (isLate) details["Late"] = `${daysLate} day(s) overdue`;

    setResult({
      type: "success",
      title: isLate ? "Return Registered (Late)" : "Return Registered Successfully",
      details,
    });
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

        <button type="button" onClick={handleValidate}
          className="mt-8 w-full rounded-lg bg-brand-700 px-4 py-4 text-xl font-semibold text-white shadow-soft hover:bg-brand-600 md:text-4xl">
          Validate Return
        </button>
      </div>
    </div>
  );
}
