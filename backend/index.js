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


const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const bookRoutes = require('./routes/livres');
app.use('/api/books', bookRoutes);

const empruntRoutes = require('./routes/emprunt');
app.use('/emprunts', empruntRoutes);


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

