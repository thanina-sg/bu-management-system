// API Service Layer for BU Management System
// Connects frontend to backend APIs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export type UserRole = 'ETUDIANT' | 'ENSEIGNANT' | 'BIBLIOTHECAIRE' | 'ADMINISTRATEUR';
export type StatutEmprunt = 'ACTIF' | 'RETOURNE' | 'EN_RETARD';
export type StatutReservation = 'EN_ATTENTE' | 'PRETE' | 'ANNULEE';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  statut?: string;
}

export interface Book {
  id?: string;
  isbn: string;
  titre: string;
  auteur: string;
  categorie: string;
  annee?: number;
  resume?: string;
  disponible: boolean;
  localisation?: string | null;
  couverture_url?: string | null;
}

export interface Loan {
  id: string;
  id_utilisateur: string;
  isbn: string;
  titre_livre?: string;
  date_emprunt: string;
  date_retour_prevue: string;
  date_retour_reelle?: string | null;
  statut: StatutEmprunt;
}

export interface Reservation {
  id: string;
  id_utilisateur: string;
  isbn: string;
  titre_livre?: string;
  date_reservation: string;
  statut: StatutReservation;
  position_file: number;
}

export interface Stats {
  totalBooks?: number;
  availableBooks?: number;
  borrowedBooks?: number;
  activeLoans?: number;
  overdueLoans?: number;
  pendingReservations?: number;
  totalUsers?: number;
  [key: string]: any;
}

// API Error Handler
class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Fetch wrapper with token handling
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorData.message || errorMsg;
      } catch {
        // If response isn't JSON, use default message
      }
      throw new APIError(response.status, errorMsg);
    }

    if (response.status === 204) {
      return null as any;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) throw error;
    const message = error instanceof Error ? error.message : 'Network error';
    throw new APIError(500, message);
  }
}

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

export const auth = {
  async loginStudent(email: string, password: string) {
    const data = await fetchAPI<{ user: User; token: string }>(
      '/auth/student/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  async loginStaff(email: string, password: string) {
    const data = await fetchAPI<{
      user: User;
      token: string;
      role: string;
    }>('/auth/staff/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  },

  async logout() {
    try {
      await fetchAPI('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return await fetchAPI<User>('/users/me');
    } catch {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return null;
    }
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
};

// ============================================
// BOOKS ENDPOINTS
// ============================================

export const books = {
  async getAll(filters?: {
    q?: string;
    category?: string;
    status?: string;
  }): Promise<Book[]> {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);

    return fetchAPI<Book[]>(
      `/books${params.toString() ? '?' + params.toString() : ''}`
    );
  },

  async getById(isbn: string): Promise<Book> {
    return fetchAPI<Book>(`/books/${isbn}`);
  },

  async getRecommendations(isbn: string): Promise<Book[]> {
    return fetchAPI<Book[]>(`/books/${isbn}/recommendations`);
  },

  async getCopies(isbn: string): Promise<any[]> {
    return fetchAPI<any[]>(`/books/${isbn}/copies`);
  },

  async create(data: {
    titre: string;
    auteur: string;
    isbn: string;
    annee: number;
    categorie: string;
    localisation: string;
    resume: string;
  }): Promise<Book> {
    return fetchAPI<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    isbn: string,
    data: {
      disponible?: boolean;
      localisation?: string;
      categorie?: string;
    }
  ): Promise<Book> {
    return fetchAPI<Book>(`/books/${isbn}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(isbn: string): Promise<void> {
    return fetchAPI(`/books/${isbn}`, { method: 'DELETE' });
  },
};

// ============================================
// LOANS ENDPOINTS
// ============================================

export const loans = {
  async getAll(filters?: {
    id_utilisateur?: string;
    statut?: string;
  }): Promise<Loan[]> {
    const params = new URLSearchParams();
    if (filters?.id_utilisateur) params.append('id_utilisateur', filters.id_utilisateur);
    if (filters?.statut) params.append('statut', filters.statut);

    return fetchAPI<Loan[]>(
      `/loans${params.toString() ? '?' + params.toString() : ''}`
    );
  },

  async create(data: {
    id_utilisateur: string;
    isbn: string;
    date_retour_prevue: string;
  }): Promise<Loan> {
    return fetchAPI<Loan>('/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async return(loanId: string, date_retour_reelle: string): Promise<Loan> {
    return fetchAPI<Loan>(`/loans/${loanId}/return`, {
      method: 'PUT',
      body: JSON.stringify({ date_retour_reelle }),
    });
  },
};

// ============================================
// RESERVATIONS ENDPOINTS
// ============================================

export const reservations = {
  async getAll(filters?: {
    id_utilisateur?: string;
    statut?: string;
  }): Promise<Reservation[]> {
    const params = new URLSearchParams();
    if (filters?.id_utilisateur) params.append('id_utilisateur', filters.id_utilisateur);
    if (filters?.statut) params.append('statut', filters.statut);

    return fetchAPI<Reservation[]>(
      `/reservations${params.toString() ? '?' + params.toString() : ''}`
    );
  },

  async create(data: {
    id_utilisateur?: string;
    isbn: string;
  }): Promise<Reservation> {
    return fetchAPI<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    statut: StatutReservation
  ): Promise<Reservation> {
    return fetchAPI<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statut }),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI(`/reservations/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// USERS ENDPOINTS
// ============================================

export const users = {
  async getAll(): Promise<User[]> {
    return fetchAPI<User[]>('/users');
  },

  async getCurrent(): Promise<User> {
    return fetchAPI<User>('/users/me');
  },

  async create(data: {
    nom: string;
    prenom: string;
    email: string;
    role: UserRole;
    password?: string;
  }): Promise<User> {
    return fetchAPI<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: {
      nom?: string;
      prenom?: string;
      email?: string;
      role?: UserRole;
    }
  ): Promise<User> {
    return fetchAPI<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI(`/users/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// STATISTICS ENDPOINTS
// ============================================

export const stats = {
  async get(): Promise<Stats> {
    return fetchAPI<Stats>('/stats');
  },
};

// ============================================
// AI / FAQ ENDPOINTS
// ============================================

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  categorie: string;
  ordre: number;
}

export const ai = {
  async getFaq(): Promise<FaqEntry[]> {
    const data = await fetchAPI<{ data: FaqEntry[] }>('/ai/faq');
    return data.data ?? [];
  },

  async query(question: string, userId?: string): Promise<{ answer: string; source?: string }> {
    return fetchAPI('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ question, userId }),
    });
  },
};

// Export error class for catching
export { APIError };
