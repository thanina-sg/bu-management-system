// src/types/book.ts
export type BookStatus = 'Available' | 'Borrowed';

export interface Book {
  isbn: string;        // matches table 'livre'
  titre: string;       // matches table 'livre'
  auteur: string;      // matches table 'livre'
  categorie: string;   // matches table 'livre'
  status: BookStatus;  // Derived from 'exemplaire.disponibilite'
  imageUrl?: string;   // We can keep this for the UI
}