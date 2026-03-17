// API Service Layer for BU Management System
// Connects frontend to backend APIs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export type UserRole = 'ETUDIANT' | 'ENSEIGNANT' | 'BIBLIOTHECAIRE' | 'ADMIN';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  name?: string; // Computed property for convenience
}

export interface Book {
  id?: string;
  isbn: string;
  titre: string;
  auteur: string;
  categorie: string;
  annee?: number;
  resume?: string;
  description?: string;
  status?: 'Available' | 'Borrowed';
  coverUrl?: string;
  location?: string;
  disponible?: boolean;
  // Convenience aliases for English
  title?: string;
  author?: string;
  category?: string;
  year?: number;
}

export interface Loan {
  id: string;
  id_utilisateur: string;
  isbn: string;
  titre_livre?: string; // Fallback if backend provides it
  date_emprunt: string;
  date_retour_prevue: string;
  date_retour_reelle?: string | null;
  statut: 'ACTIF' | 'RETOURNE' | 'EN_RETARD';
  // English aliases
  bookTitle?: string;
  loanDate?: string;
  returnDateExpected?: string;
  returnDateActual?: string | null;
  status?: string;
}

export interface Reservation {
  id: string;
  id_utilisateur: string;
  isbn: string;
  titre_livre?: string;
  date_reservation: string;
  statut: 'EN_ATTENTE' | 'PRETE' | 'ANNULEE';
  position_file: number;
  // English aliases
  bookTitle?: string;
  date?: string;
  queuePosition?: number;
  status?: string;
}

export interface Stats {
  totalBooks?: number;
  availableBooks?: number;
  borrowedBooks?: number;
  activeLoans?: number;
  overdueLoans?: number;
  pendingReservations?: number;
  totalUsers?: number;
  [key: string]: any; // Allow additional stats fields
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
    
    // Helper function to transform French field names to English
    const transformData = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;
      
      // Handle arrays
      if (Array.isArray(obj)) {
        return obj.map(item => transformData(item));
      }
      
      // Handle objects
      const transformed = { ...obj };
      
      // User field mappings
      if (transformed.nom && !transformed.name) {
        transformed.name = `${transformed.prenom || ''} ${transformed.nom}`.trim();
      }
      
      // Book field mappings
      if (transformed.titre && !transformed.title) {
        transformed.title = transformed.titre;
      }
      if (transformed.auteur && !transformed.author) {
        transformed.author = transformed.auteur;
      }
      if (transformed.categorie && !transformed.category) {
        transformed.category = transformed.categorie;
      }
      
      // Loan field mappings
      if (transformed.titre_livre && !transformed.bookTitle) {
        transformed.bookTitle = transformed.titre_livre;
      }
      if (transformed.date_emprunt && !transformed.loanDate) {
        transformed.loanDate = transformed.date_emprunt;
      }
      if (transformed.date_retour_prevue && !transformed.returnDateExpected) {
        transformed.returnDateExpected = transformed.date_retour_prevue;
      }
      if (transformed.date_retour_reelle && !transformed.returnDateActual) {
        transformed.returnDateActual = transformed.date_retour_reelle;
      }
      
      // Status mappings (French to English)
      if (transformed.statut) {
        const statusMap: { [key: string]: string } = {
          'ACTIF': 'Active',
          'RETOURNE': 'Returned',
          'EN_RETARD': 'Overdue',
          'EN_ATTENTE': 'Pending',
          'PRETE': 'Ready',
          'ANNULEE': 'Cancelled'
        };
        if (!transformed.status && statusMap[transformed.statut]) {
          transformed.status = statusMap[transformed.statut];
        }
      }
      
      // Book status mapping
      if (transformed.disponible === false && !transformed.status) {
        transformed.status = 'Borrowed';
      } else if (transformed.disponible === true && !transformed.status) {
        transformed.status = 'Available';
      }
      
      // Reservation field mappings
      if (transformed.titre_livre && !transformed.bookTitle) {
        transformed.bookTitle = transformed.titre_livre;
      }
      if (transformed.date_reservation && !transformed.date) {
        transformed.date = transformed.date_reservation;
      }
      if (transformed.position_file && !transformed.queuePosition) {
        transformed.queuePosition = transformed.position_file;
      }
      
      return transformed;
    };
    
    return transformData(data);
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
    const user = JSON.parse(userStr);
    // Ensure name property exists
    if (!user.name && (user.nom || user.prenom)) {
      user.name = `${user.prenom || ''} ${user.nom || ''}`.trim();
    }
    return user;
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

  async create(data: {
    title: string;
    author: string;
    isbn: string;
    year: number;
    category: string;
    location: string;
    description: string;
  }): Promise<Book> {
    return fetchAPI<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    isbn: string,
    data: {
      status?: string;
      location?: string;
      category?: string;
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
    studentId?: string;
    status?: string;
  }): Promise<Loan[]> {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.status) params.append('status', filters.status);

    return fetchAPI<Loan[]>(
      `/loans${params.toString() ? '?' + params.toString() : ''}`
    );
  },

  async create(data: {
    studentId: string;
    isbn: string;
    returnDateExpected: string;
  }): Promise<Loan> {
    return fetchAPI<Loan>('/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async return(loanId: string, returnDateActual: string): Promise<Loan> {
    return fetchAPI<Loan>(`/loans/${loanId}/return`, {
      method: 'PUT',
      body: JSON.stringify({ returnDateActual }),
    });
  },
};

// ============================================
// RESERVATIONS ENDPOINTS
// ============================================

export const reservations = {
  async getAll(filters?: {
    studentId?: string;
    status?: string;
  }): Promise<Reservation[]> {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.status) params.append('status', filters.status);

    return fetchAPI<Reservation[]>(
      `/reservations${params.toString() ? '?' + params.toString() : ''}`
    );
  },

  async create(data: {
    studentId: string;
    isbn: string;
  }): Promise<Reservation> {
    return fetchAPI<Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    status: 'Pending' | 'Ready' | 'Cancelled'
  ): Promise<Reservation> {
    return fetchAPI<Reservation>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
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
    name: string;
    email: string;
    role: UserRole;
  }): Promise<User> {
    return fetchAPI<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: string,
    data: {
      name?: string;
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

// Export error class for catching
export { APIError };
