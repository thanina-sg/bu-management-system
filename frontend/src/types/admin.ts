export type SystemRule = {
  id: string;
  title: string;
  description: string;
  active: boolean;
};

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  privileges: string[];
};

export type AdminMetrics = {
  totalBooks: number;
  activeEmprunts: number;
  totalUsers: number;
  administrators: number;
  librarians: number;
};

export type BookItem = {
  isbn: string;
  titre: string;
  auteur: string;
  categorie: string;
  resume?: string | null;
  annee?: number | null;
};

export type ReservationItem = {
  id: string;
  id_utilisateur: string;
  isbn: string;
  date_reservation: string;
  statut: string;
  position_file: number;
  utilisateur: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  livre: {
    isbn: string;
    titre: string;
    auteur: string;
    categorie: string;
  };
};

export type Exemplaire = {
  id_exemplaire: string;
  isbn: string;
  etat: string;
  localisation: string;
  disponibilite: boolean;
};

export type EmpruntItem = {
  id: string;
  id_utilisateur: string;
  id_exemplaire: string;
  date_emprunt: string;
  date_retour_prevue: string;
  date_retour_reelle: string | null;
  utilisateur: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  exemplaire: Exemplaire;
};
