import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { TopNavLink } from "./TopNavLink";
import { SearchOverlay } from "./SearchOverlay";
import { AccountPanel } from "./AccountPanel";

export function AppShell() {
  const [showSearch, setShowSearch] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f5f9]">
      <header className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-brand-600 text-[8px] text-brand-700">
              ▦
            </span>
            University Library
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            <TopNavLink to="/">Catalog</TopNavLink>
            <TopNavLink to="/librarian">Staff Portal</TopNavLink>
          </nav>

          <div className="flex items-center gap-3 text-ink-500">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setShowSearch(true)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] hover:bg-surface-100"
            >
              ⌕
            </button>
            <div className="h-5 w-px bg-ink-100" />
            <button
              type="button"
              aria-label="Account"
              onClick={() => setShowAccount(true)}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-100 text-[11px] hover:bg-surface-200"
            >
              ◉
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      {showAccount && <AccountPanel onClose={() => setShowAccount(false)} />}
    </div>
  );
}
