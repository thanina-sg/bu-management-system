const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

// Load environment variables (Make sure you have dotenv installed)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- 1. Global Middleware ---
app.use(cors());
app.use(express.json());

// --- 2. Swagger Documentation ---
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- 3. OpenAPI Validation (Disabled for now) ---
app.use(
    OpenApiValidator.middleware({
        apiSpec: path.join(__dirname, './swagger.yaml'),
        validateRequests: true,
        validateResponses: false,
    }),
);

// --- 4. Route Imports ---
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const livresRoutes = require('./routes/livres');
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');
const reservationsRoutes = require('./routes/reservations');
const empruntRoutes = require('./routes/emprunt');
const statsRoutes = require('./routes/stats');

// --- 5. Route Registration with /api prefix ---
// Authentication endpoints
app.use('/api/auth', authRoutes);

// Books endpoints
app.use('/api/books', livresRoutes);
app.use('/api/livres', livresRoutes); // French alias

// Loans endpoints
app.use('/api/loans', empruntRoutes);
app.use('/api/emprunts', empruntRoutes); // French alias

// Reservations endpoints
app.use('/api/reservations', reservationsRoutes);

// Users endpoints
app.use('/api/users', usersRoutes);

// Stats endpoints
app.use('/api/stats', statsRoutes);

// Other routes
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// --- 6. Base Routes & Error Handling ---
app.get('/', (req, res) => {
    res.send('API Bibliothèque UHA is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
    // Log error for debugging
    console.error(err);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        errors: err.errors, // Useful for OpenAPI validation errors
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
});
