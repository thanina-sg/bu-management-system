const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path'); 
const OpenApiValidator = require('express-openapi-validator');

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(
    OpenApiValidator.middleware({
      apiSpec: './swagger.yaml',
      validateRequests: true, 
      validateResponses: false, 

    }),
  );

const livresRoutes = require('./routes/livres');
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');
const reservationsRoutes = require('./routes/reservations');
const empruntsRoutes = require('./routes/emprunts');
app.use('/livres', livresRoutes);
app.use('/admin', adminRoutes);
app.use('/users', usersRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/emprunts', empruntsRoutes);
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
