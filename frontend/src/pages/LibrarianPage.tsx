import { useState } from "react";
import { RoleBadge } from "../components/StatusBadges";
import { StaffLoginForm } from "../components/librarian/StaffLoginForm";
import { LoanForm } from "../components/librarian/LoanForm";
import { ReturnForm } from "../components/librarian/ReturnForm";
import { ReservationsPanel } from "../components/librarian/ReservationsPanel";
import { BooksPanel } from "../components/librarian/BooksPanel";
import { UsersPanel } from "../components/librarian/UsersPanel";
import { DashboardCards } from "../components/librarian/DashboardCards";
import type { LoggedInRole, PortalView } from "../components/librarian/types";

const LIBRARIAN_TABS: { key: PortalView; label: string }[] = [
  { key: "loan", label: "New Loan" },
  { key: "return", label: "Return" },
  { key: "reservations", label: "Reservations" },
  { key: "books", label: "Books" },
];

const ADMIN_TABS: { key: PortalView; label: string }[] = [
  ...LIBRARIAN_TABS,
  { key: "users", label: "Users" },
];

export function LibrarianPage() {
  const [view, setView] = useState<PortalView>("login");
  const [loggedInRole, setLoggedInRole] = useState<LoggedInRole>("Librarian");
  const [loggedInName, setLoggedInName] = useState("");

  if (view === "login") {
    return (
      <StaffLoginForm
        onLogin={(role, name) => {
          setLoggedInRole(role);
          setLoggedInName(name);
          setView("loan");
        }}
      />
    );
  }

  const tabs = loggedInRole === "Admin" ? ADMIN_TABS : LIBRARIAN_TABS;

  const subtitles: Record<Exclude<PortalView, "login">, string> = {
    loan: "Register a new resource loan",
    return: "Register a resource return",
    reservations: "View and manage all reservations",
    books: "View and manage book catalog",
    users: "Manage user accounts and roles",
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-surface-200 text-xl text-brand-700">
          ⎘
        </div>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink-900 md:text-6xl">
          {loggedInRole === "Admin" ? "Admin Portal" : "Librarian Portal"}
        </h1>
        <div className="mt-2 flex items-center justify-center gap-2">
          <RoleBadge role={loggedInRole} />
          <span className="text-sm text-ink-500">{loggedInName}</span>
        </div>
        <p className="mt-2 text-lg text-ink-500 md:text-3xl">{subtitles[view]}</p>

        <div className="mt-6 inline-flex flex-wrap justify-center rounded-lg border border-ink-100 bg-white p-1 shadow-soft">
          {tabs.map((tab) => (
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
        <DashboardCards role={loggedInRole} />
      </div>

      <div className="mt-8 flex justify-center">
        {view === "loan" && <LoanForm />}
        {view === "return" && <ReturnForm />}
        {view === "reservations" && <ReservationsPanel />}
        {view === "books" && <BooksPanel role={loggedInRole} />}
        {view === "users" && loggedInRole === "Admin" && <UsersPanel />}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => { setView("login"); setLoggedInRole("Librarian"); setLoggedInName(""); }}
          className="text-xs font-semibold text-ink-500 hover:text-ink-700"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
