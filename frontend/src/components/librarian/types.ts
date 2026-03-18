export type LoggedInRole = "Librarian" | "Admin";
export type PortalView = "login" | "overview" | "loan" | "return" | "reservations" | "books" | "exemplaires" | "users" | "students" | "librarians";
export type FormResult =
  | { type: "success"; title: string; details: Record<string, string> }
  | { type: "error"; message: string }
  | null;
