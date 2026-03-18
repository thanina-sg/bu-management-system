import type { Book } from "./api";

export type BookCategory = string;
export type BookStatus = "Disponible" | "Emprunte";

export type Filters = {
  q: string;
  category: "Toutes categories" | BookCategory;
  status: "Tous" | BookStatus;
};

export function applyFilters(books: Book[], filters: Filters) {
  const q = filters.q.trim().toLowerCase();

  return books.filter((b) => {
    const title = (b.titre || "").toLowerCase();
    const author = (b.auteur || "").toLowerCase();
    const isbn = (b.isbn || "").toLowerCase();
    
    const matchesQ =
      q.length === 0 ||
      title.includes(q) ||
      author.includes(q) ||
      isbn.includes(q);

    const category = b.categorie;
    const matchesCategory =
      filters.category === "Toutes categories" || category === filters.category;

    const status = b.disponible ? "Disponible" : "Emprunte";
    const matchesStatus = filters.status === "Tous" || status === filters.status;

    return matchesQ && matchesCategory && matchesStatus;
  });
}
