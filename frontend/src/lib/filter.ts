import type { Book, BookCategory, BookStatus } from "./books";

export type Filters = {
  q: string;
  category: "All Categories" | BookCategory;
  status: "All Status" | BookStatus;
};

export function applyFilters(books: Book[], filters: Filters) {
  const q = filters.q.trim().toLowerCase();

  return books.filter((b) => {
    const matchesQ =
      q.length === 0 ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q);

    const matchesCategory =
      filters.category === "All Categories" || b.category === filters.category;

    const matchesStatus = filters.status === "All Status" || b.status === filters.status;

    return matchesQ && matchesCategory && matchesStatus;
  });
}
