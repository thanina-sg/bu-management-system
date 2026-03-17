// This file is deprecated - all data should come from api.ts
// Re-export types from api.ts for backwards compatibility

export type { Book, User, Loan, Reservation, Stats, UserRole } from "./api";

// Filter types (kept for compatibility)
export type BookStatus = "Available" | "Borrowed";
export type BookCategory = string;

