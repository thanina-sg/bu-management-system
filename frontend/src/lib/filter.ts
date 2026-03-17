import type { Book } from "./api";

export type BookCategory = string;
export type BookStatus = "Available" | "Borrowed";

export type Filters = {
  q: string;
  category: "All Categories" | BookCategory;
  status: "All Status" | BookStatus;
};

export function applyFilters(books: Book[], filters: Filters) {
  const q = filters.q.trim().toLowerCase();

  return books.filter((b) => {
    const title = (b.title || b.titre || "").toLowerCase();
    const author = (b.author || b.auteur || "").toLowerCase();
    const isbn = (b.isbn || "").toLowerCase();
    
    const matchesQ =
      q.length === 0 ||
      title.includes(q) ||
      author.includes(q) ||
      isbn.includes(q);

    const category = b.category || b.categorie;
    const matchesCategory =
      filters.category === "All Categories" || category === filters.category;

    const status = b.status || (b.disponible === false ? "Borrowed" : "Available");
    const matchesStatus = filters.status === "All Status" || status === filters.status;

    return matchesQ && matchesCategory && matchesStatus;
  });
}
