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
      validateResponses: true, 
    }),
  );

const livresRoutes = require('./routes/livres');
app.use('/livres', livresRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


