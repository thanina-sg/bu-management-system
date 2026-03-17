const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const app = express();
const PORT = 5000;

// --- MIDDLEWARES DE BASE ---
app.use(cors());
app.use(express.json());

// --- DOCUMENTATION SWAGGER ---
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- VALIDATEUR OPENAPI ---
// Il vérifie que tes requêtes correspondent au Swagger en temps réel
app.use(
  OpenApiValidator.middleware({
    apiSpec: './swagger.yaml',
    validateRequests: true,
    validateResponses: false,
  }),
);

// --- IMPORT DES ROUTES ---
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/livres');
const loanRoutes = require('./routes/emprunt');
const reservationRoutes = require('./routes/reservations');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// --- MONTAGE DES ROUTES (Aligné sur Swagger) ---
app.use('/auth', authRoutes);            // Inscription / Connexion
app.use('/api/books', bookRoutes);       // Catalogue (GET, POST, PUT, DELETE)
app.use('/api/loans', loanRoutes);       // Emprunts & Retours
app.use('/api/reservations', reservationRoutes); // Réservations
app.use('/api/users', userRoutes);       // Profils & Annuaire
app.use('/admin', adminRoutes);          // Règles, Metrics & Admin Users

// Route de test
app.get('/', (req, res) => {
    res.send('L’API de la Bibliothèque UHA est opérationnelle.');
});

// --- GESTION DES ERREURS ---
// Important pour attraper les erreurs de validation OpenAPI
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors, // Affiche les détails si le JSON envoyé est incorrect
  });
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
    console.log(`Documentation disponible sur http://localhost:${PORT}/api-docs`);
});