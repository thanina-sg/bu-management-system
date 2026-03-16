import { useEffect, useMemo, useState } from 'react';
import { AdminRuleCard } from '../components/Admin/AdminRuleCard';
import { AdminUserCard } from '../components/Admin/AdminUserCard';
import type {
  AdminMetrics,
  SystemRule,
  AdminUser,
  BookItem,
  ReservationItem,
  EmpruntItem,
} from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: '🏠' },
  { id: 'rules', label: 'Paramétrer les règles', icon: '⚙️' },
  { id: 'users', label: 'Gérer les comptes', icon: '👥' },
  { id: 'messages', label: 'Messagerie', icon: '💬' },
];

type StatDefinition = {
  key: keyof AdminMetrics;
  label: string;
  helper: string;
  color: string;
  icon: string;
};

const statDefinitions: StatDefinition[] = [
  { key: 'totalBooks', label: 'Livres référencés', helper: 'Catalogue complet', color: 'from-blue-500/20 to-blue-400/30', icon: '📚' },
  { key: 'activeEmprunts', label: 'Emprunts en cours', helper: 'Sans retour', color: 'from-cyan-500/20 to-cyan-400/30', icon: '🕐' },
  { key: 'totalUsers', label: 'Utilisateurs', helper: 'Tous les profils', color: 'from-slate-500/20 to-slate-400/30', icon: '👥' },
  { key: 'librarians', label: 'Bibliothécaires', helper: 'Opérationnels', color: 'from-amber-500/20 to-amber-400/30', icon: '🧑‍🏫' },
];

export const AdminDashboard = () => {
  const [rules, setRules] = useState<SystemRule[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [emprunts, setEmprunts] = useState<EmpruntItem[]>([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recentBooks = useMemo(() => books.slice(0, 3), [books]);
  const recentReservations = useMemo(() => reservations.slice(0, 3), [reservations]);
  const recentEmprunts = useMemo(() => emprunts.slice(0, 3), [emprunts]);

  const formatDate = (value?: string) =>
    value
      ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
          new Date(value),
        )
      : 'N/A';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rulesRes, usersRes, metricsRes, booksRes, reservationsRes, empruntsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/rules`),
          fetch(`${API_BASE_URL}/admin/users`),
          fetch(`${API_BASE_URL}/admin/metrics`),
          fetch(`${API_BASE_URL}/livres`),
          fetch(`${API_BASE_URL}/reservations`),
          fetch(`${API_BASE_URL}/emprunts`),
        ]);

        if (
          !rulesRes.ok ||
          !usersRes.ok ||
          !metricsRes.ok ||
          !booksRes.ok ||
          !reservationsRes.ok ||
          !empruntsRes.ok
        ) {
          throw new Error('Impossible de récupérer les données depuis le serveur');
        }

        const rulesJson = await rulesRes.json();
        const usersJson = await usersRes.json();
        const metricsJson = await metricsRes.json();
        const booksJson = await booksRes.json();
        const reservationsJson = await reservationsRes.json();
        const empruntsJson = await empruntsRes.json();

        setRules(rulesJson.data ?? []);
        setUsers(usersJson.data ?? []);
        setMetrics(metricsJson.data ?? null);
        setBooks(booksJson.data ?? []);
        setReservations(reservationsJson.data ?? []);
        setEmprunts(empruntsJson.data ?? []);
      } catch (err: any) {
        setError(err.message ?? 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleRule = async (ruleId: string, nextState: boolean) => {
    setRules((prev) =>
      prev.map((entry) => (entry.id === ruleId ? { ...entry, active: nextState } : entry)),
    );

    try {
      const res = await fetch(`${API_BASE_URL}/admin/rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextState }),
      });
      if (!res.ok) {
        throw new Error('La mise à jour a échoué');
      }
    } catch (err) {
      setRules((prev) =>
        prev.map((entry) => (entry.id === ruleId ? { ...entry, active: !nextState } : entry)),
      );
      setError('Impossible de mettre à jour la règle pour le moment');
    }
  };

  const getStatValue = (key: keyof AdminMetrics): number => {
    if (!metrics) return 0;
    return metrics[key] ?? 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-64 bg-white border-r border-blue-100 flex-col">
          <div className="flex-1 px-6 py-8 space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-400">Portail</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-2">Pôle Administration</h1>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`w-full text-left rounded-2xl px-4 py-3 flex items-center gap-3 text-sm font-medium transition ${
                    item.id === 'rules'
                      ? 'bg-blue-50 text-blue-700 shadow'
                      : 'text-slate-500 hover:text-blue-600'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="px-6 py-8 border-t border-blue-100 bg-gradient-to-t from-blue-600 to-blue-500 text-white">
            <p className="font-semibold">Nina Sg</p>
            <p className="text-sm text-blue-100">ninasg@example.com</p>
            <p className="text-xs uppercase tracking-widest mt-3">Administrateur</p>
          </div>
        </aside>

        <main className="flex-1 px-6 py-10 space-y-10">
          <header>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Gestion</p>
            <h2 className="text-3xl font-bold text-slate-900">Paramétrer le système</h2>
            <p className="text-slate-500 mt-1">
              Activez les règles critiques, gérez les comptes et suivez les indicateurs clés.
            </p>
          </header>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-4">
            {statDefinitions.map((stat) => (
              <article
                key={stat.key}
                className={`rounded-2xl bg-gradient-to-br ${stat.color} border border-white/30 p-5 shadow-sm`}
              >
                <p className="text-2xl">{stat.icon}</p>
                <p className="text-xs uppercase tracking-widest text-slate-500 mt-3">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{getStatValue(stat.key)}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.helper}</p>
              </article>
            ))}
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-slate-900">Paramétrer les règles</h3>
              <p className="text-sm text-slate-500">
                Les règles actives sont appliquées immédiatement sur la plateforme.
              </p>
            </div>
            {loading ? (
              <div className="text-sm text-slate-500">Chargement des règles…</div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {rules.map((rule) => (
                  <AdminRuleCard key={rule.id} rule={rule} onToggle={handleToggleRule} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-slate-900">Gérer les comptes utilisateurs</h3>
              <p className="text-sm text-slate-500">Supervisez les accès et les statuts des membres.</p>
            </div>
            {loading ? (
              <div className="text-sm text-slate-500">Chargement des utilisateurs…</div>
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                {users.map((user) => (
                  <AdminUserCard key={user.id} user={user} />
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-slate-900">Derniers livres ajoutés</h3>
              <p className="text-sm text-slate-500">Les entrées les plus récentes du catalogue.</p>
            </div>
            {loading ? (
              <div className="text-sm text-slate-500">Chargement des livres…</div>
            ) : recentBooks.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun livre à afficher.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {recentBooks.map((book) => (
                  <article key={book.isbn} className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Catalogue</p>
                    <h4 className="text-lg font-semibold text-slate-900 mt-2">{book.titre}</h4>
                    <p className="text-sm text-slate-500">{book.auteur}</p>
                    <p className="text-xs text-slate-500 mt-2">{book.categorie}</p>
                    <p className="text-xs text-slate-400 mt-1">{book.annee ?? 'Année non renseignée'}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-slate-900">Réservations récentes</h3>
              <p className="text-sm text-slate-500">Suivez les dernières demandes d’ouvrages.</p>
            </div>
            {loading ? (
              <div className="text-sm text-slate-500">Chargement des réservations…</div>
            ) : recentReservations.length === 0 ? (
              <p className="text-sm text-slate-500">Aucune réservation en attente.</p>
            ) : (
              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <article
                    key={reservation.id}
                    className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-slate-900">{reservation.livre.titre}</h4>
                      <span className="text-xs uppercase tracking-widest text-blue-500 font-semibold">
                        {reservation.statut}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {reservation.utilisateur.prenom} {reservation.utilisateur.nom} ({reservation.utilisateur.email})
                    </p>
                    <p className="text-xs text-slate-400">
                      Demande le {formatDate(reservation.date_reservation)} • position {reservation.position_file}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="px-2 py-1 rounded-full bg-slate-100">{reservation.livre.auteur}</span>
                      <span className="px-2 py-1 rounded-full bg-slate-100">{reservation.livre.categorie}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-slate-900">Emprunts actifs</h3>
              <p className="text-sm text-slate-500">Surveillez les emprunts sans retour confirmé.</p>
            </div>
            {loading ? (
              <div className="text-sm text-slate-500">Chargement des emprunts…</div>
            ) : recentEmprunts.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun emprunt actif.</p>
            ) : (
              <div className="space-y-4">
                {recentEmprunts.map((emprunt) => (
                  <article
                    key={emprunt.id}
                    className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-slate-900">
                        {emprunt.exemplaire.isbn}
                      </h4>
                      <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
                        {emprunt.date_retour_reelle ? 'Retour effectué' : 'En cours'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {emprunt.utilisateur.prenom} {emprunt.utilisateur.nom} ({emprunt.utilisateur.email})
                    </p>
                    <p className="text-xs text-slate-400">
                      Emprunté le {formatDate(emprunt.date_emprunt)} • Retour prévu le {formatDate(emprunt.date_retour_prevue)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Localisation {emprunt.exemplaire.localisation} • État {emprunt.exemplaire.etat}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
