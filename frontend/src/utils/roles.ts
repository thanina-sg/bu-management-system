export type DashboardRole = 'ADMIN' | 'BIBLIOTECARIE';
export type GeneralRole = 'ETUDIANT' | 'ENSEIGNANT';
export type AppUserRole = DashboardRole | GeneralRole | null;

const normalizeInput = (input?: string | null): string | null => {
  if (!input) return null;
  return input.trim().toUpperCase();
};

export const normalizeRole = (input?: string | null): AppUserRole => {
  const normalized = normalizeInput(input);
  if (!normalized) return null;

  if (['ADMIN', 'ADMINISTRATEUR'].includes(normalized)) {
    return 'ADMIN';
  }

  if (['BIBLIOTHECAIRE', 'BIBLIOTHECARIE', 'BIBLIOTHEQUE'].includes(normalized)) {
    return 'BIBLIOTECARIE';
  }

  if (['ETUDIANT', 'STUDENT'].includes(normalized)) {
    return 'ETUDIANT';
  }

  if (['ENSEIGNANT', 'PROFESSEUR', 'PROF'].includes(normalized)) {
    return 'ENSEIGNANT';
  }

  return null;
};

export const isDashboardRole = (role: AppUserRole): role is DashboardRole => {
  return role === 'ADMIN' || role === 'BIBLIOTECARIE';
};
