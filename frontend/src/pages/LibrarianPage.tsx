import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RoleBadge } from "../components/StatusBadges";
import { StaffLoginForm } from "../components/librarian/StaffLoginForm";
import { LoanForm } from "../components/librarian/LoanForm";
import { ReturnForm } from "../components/librarian/ReturnForm";
import { ReservationsPanel } from "../components/librarian/ReservationsPanel";
import { BooksPanel } from "../components/librarian/BooksPanel";
import { UsersPanel } from "../components/librarian/UsersPanel";
import { DashboardCards } from "../components/librarian/DashboardCards";
import { books as booksAPI, loans as loansAPI, reservations as reservationsAPI, users as usersAPI } from "../lib/api";
import type { LoggedInRole, PortalView } from "../components/librarian/types";

const LIBRARIAN_TABS: { key: PortalView; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "loan", label: "Nouvel emprunt" },
  { key: "return", label: "Retour" },
  { key: "reservations", label: "Reservations" },
  { key: "books", label: "Livres" },
];

const ADMIN_TABS: { key: PortalView; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Utilisateurs" },
  { key: "librarians", label: "Bibliothecaires" },
  { key: "books", label: "Livres" },
  { key: "reservations", label: "Reservations" },
];

export function LibrarianPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<PortalView>("login");
  const [loggedInRole, setLoggedInRole] = useState<LoggedInRole>("Librarian");
  const [loggedInName, setLoggedInName] = useState("");
  const [booksList, setBooksList] = useState<any[]>([]);
  const [loansList, setLoansList] = useState<any[]>([]);
  const [reservationsList, setReservationsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setView("login");
    setLoggedInRole("Librarian");
    setLoggedInName("");
    // Notify other components (e.g., AppShell) about logout
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate("/");
  };

  // Restore auth from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("authToken");
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        
        // Redirect non-staff users away from librarian portal
        if (user.role !== 'BIBLIOTHECAIRE' && user.role !== 'ADMINISTRATEUR') {
          navigate("/");
          return;
        }
        
        const roleMap: Record<string, LoggedInRole> = {
          'BIBLIOTHECAIRE': 'Librarian',
          'ADMINISTRATEUR': 'Admin',
        };
        const uiRole = roleMap[user.role] || 'Librarian';
        setLoggedInRole(uiRole);
        setLoggedInName(`${user.prenom || ''} ${user.nom || ''}`.trim() || user.email);
        // Set overview as default view
        setView("overview");
      } catch (err) {
        console.error("Failed to restore auth:", err);
      }
    }
  }, [navigate]);

  // Fetch dashboard data when user logs in
  useEffect(() => {
    if (view !== "login") {
      const fetchDashboardData = async () => {
        try {
          const [allBooks, allLoans, allReservations, allUsers] = await Promise.all([
            booksAPI.getAll().catch(() => []),
            loansAPI.getAll().catch(() => []),
            reservationsAPI.getAll().catch(() => []),
            usersAPI.getAll().catch(() => []),
          ]);
          setBooksList(allBooks || []);
          setLoansList(allLoans || []);
          setReservationsList(allReservations || []);
          setUsersList(allUsers || []);
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
        }
      };
      fetchDashboardData();
    }
  }, [view]);

  if (view === "login") {
    return (
      <StaffLoginForm
        onLogin={(role, name) => {
          setLoggedInRole(role);
          setLoggedInName(name);
          setView("overview");
        }}
      />
    );
  }

  const tabs = loggedInRole === "Admin" ? ADMIN_TABS : LIBRARIAN_TABS;
  
  // Filter out users tabs for librarians (only show for Admin)
  const displayTabs = loggedInRole === "Librarian" 
    ? tabs.filter(tab => !["users", "students", "librarians"].includes(tab.key))
    : tabs;

  const subtitles: Record<Exclude<PortalView, "login">, string> = {
    overview: "Aperçu du tableau de bord",
    loan: "Enregistrer un nouvel emprunt",
    return: "Enregistrer un retour",
    reservations: "Voir et gerer toutes les reservations",
    books: loggedInRole === "Admin" ? "Gerer le catalogue de livres" : "Consulter et gerer le catalogue",
    exemplaires: "Consulter tous les exemplaires groupes par livre",
    users: "Gerer les etudiants et enseignants",
    students: "Gerer les etudiants et enseignants",
    librarians: "Gerer le personnel de bibliotheque",
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-lg text-rose-600 hover:bg-rose-200 transition-colors"
          >
            ✕
          </button>
        </div>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink-900 md:text-6xl">
          {loggedInRole === "Admin" ? "Portail administrateur" : "Portail bibliothecaire"}
        </h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <RoleBadge role={loggedInRole} />
          <span className="text-sm text-ink-500">{loggedInName}</span>
        </div>
        <p className="mt-2 text-lg text-ink-500 md:text-3xl">{subtitles[view]}</p>

        <div className="mt-6 inline-flex flex-wrap justify-center rounded-lg border border-ink-100 bg-white p-1 shadow-soft">
          {displayTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={
                view === tab.key
                  ? "rounded-md bg-brand-700 px-5 py-2 text-xs font-semibold text-white"
                  : "rounded-md px-5 py-2 text-xs font-semibold text-ink-500 hover:text-ink-700"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {view === "overview" && (
          <DashboardCards role={loggedInRole} books={booksList} loans={loansList} reservations={reservationsList} users={usersList} />
        )}
      </div>

      <div className="mt-8 flex justify-center">
        {view === "loan" && loggedInRole === "Librarian" && <LoanForm />}
        {view === "return" && loggedInRole === "Librarian" && <ReturnForm />}
        {view === "reservations" && <ReservationsPanel />}
        {view === "books" && <BooksPanel role={loggedInRole} />}
        {view === "users" && loggedInRole === "Admin" && <UsersPanel roleFilter={["ETUDIANT", "ENSEIGNANT"]} />}
        {view === "students" && loggedInRole === "Admin" && <UsersPanel roleFilter={["ETUDIANT", "ENSEIGNANT"]} />}
        {view === "librarians" && loggedInRole === "Admin" && <UsersPanel roleFilter={["BIBLIOTHECAIRE"]} />}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleLogout}
          className="text-xs font-semibold text-ink-500 hover:text-rose-600 transition-colors"
        >
          Se deconnecter
        </button>
      </div>
    </div>
  );
}
