// Données de test (doivent matcher le YAML)
const catalogue = [
    { 
        isbn: "978-2070413119", 
        titre: "L'Étranger", 
        auteur: "Albert Camus", 
        categorie: "Roman", 
        annee: 1942 
    },
    { 
        isbn: "978-2253006329", 
        titre: "1984", 
        auteur: "George Orwell", 
        categorie: "Dystopie", 
        annee: 1949 
    }
];

const getAllBooks = () => {
    return catalogue;
};

module.exports = {
    getAllBooks
};
