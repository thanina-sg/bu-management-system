export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
};

export type DashboardSection = 'overview' | 'books' | 'users' | 'statistics' | 'reservations' | 'returns' | 'copies' | 'settings';

export type UserRole = 'admin' | 'librarian';
