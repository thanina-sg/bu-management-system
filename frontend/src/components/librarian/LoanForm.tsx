import { useState, useEffect } from "react";
import { users as usersAPI, books as booksAPI, loans as loansAPI, type User, type Book } from "../../lib/api";
import { FormResultBanner } from "./FormResultBanner";
import type { FormResult } from "./types";

export function LoanForm() {
  const [userSearch, setUserSearch] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [loanDate, setLoanDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
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
        console.error("Impossible de charger les utilisateurs:", err);
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
        setResult({ type: "error", message: "Veuillez selectionner un usager et saisir un ISBN." });
        return;
      }

      // Get selected student
      const student = allUsers.find(u => u.id === selectedUserId);
      if (!student) {
        setResult({ type: "error", message: "Usager introuvable." });
        return;
      }

      // Fetch books and validate book exists and is available
      const books = await booksAPI.getAll();
      const book: Book | undefined = books.find((b: Book) => b.isbn === isbn.trim());
      if (!book) {
        setResult({ type: "error", message: `Livre introuvable: l'ISBN "${isbn}" ne correspond a aucune ressource du catalogue.` });
        return;
      }

      if (!book.disponible) {
        const bookTitle = book.titre;
        setResult({ type: "error", message: `"${bookTitle}" est actuellement emprunte et indisponible.` });
        return;
      }

      await loansAPI.create({
        id_utilisateur: selectedUserId,
        isbn: isbn.trim(),
        date_retour_prevue: returnDate,
      });

      const studentName = `${student.prenom || ''} ${student.nom || ''}`.trim();
      const bookTitle = book.titre;
      
      setResult({
        type: "success",
        title: "Emprunt enregistre avec succes",
        details: {
          "Usager": `${studentName} (${student.email})`,
          "Livre": bookTitle,
          "ISBN": book.isbn,
          "Date d'emprunt": loanDate,
          "Retour prevu": returnDate,
          "Statut": "ACTIF",
        },
      });
    } catch (error) {
      setResult({ type: "error", message: `Erreur lors de la validation de l'emprunt: ${error instanceof Error ? error.message : "Erreur inconnue"}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="rounded-xl border border-ink-100 border-t-4 border-t-brand-700 bg-white p-4 text-left shadow-soft">
        <div className="font-serif text-2xl text-ink-900 md:text-4xl">Nouvel emprunt</div>
        <p className="mt-2 text-sm text-ink-500 md:text-base">
          Saisissez les informations de l'usager et de la ressource pour enregistrer l'emprunt.
        </p>

        <div className="mt-5 rounded-lg border border-ink-100 bg-surface-50 p-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25CE; Rechercher un usager</label>
            <div className="relative">
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onFocus={() => userSearch.trim() && setShowDropdown(true)}
                placeholder="Tapez un e-mail ou un nom..."
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
                ✓ Selectionne: {userSearch}
              </div>
            )}
          </div>
          <div className="mt-3">
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25A1; ISBN du livre</label>
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
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25F7; Date d'emprunt</label>
            <input type="date" value={loanDate} onChange={(e) => setLoanDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 md:text-base" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink-900">&#x25F7; Date de retour</label>
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
              className="w-full rounded-lg border border-ink-100 bg-white px-3 py-2 text-sm text-ink-900 outline-none focus:border-brand-500 md:text-base" />
          </div>
        </div>

        <FormResultBanner result={result} />

        <button type="button" onClick={handleValidate} disabled={isLoading}
          className="mt-6 w-full rounded-lg bg-brand-700 px-3 py-2.5 text-base font-semibold text-white shadow-soft hover:bg-brand-600 disabled:bg-ink-300 md:text-lg">
          {isLoading ? "Validation..." : "Valider l'emprunt"}
        </button>
      </div>
    </div>
  );
}
