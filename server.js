require('dotenv').config();
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/index');

// Import product and user routes
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/users');

// Middleware to parse the body of requests
app.use(bodyParser.json());

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API to manage products and users',
        },
    },
    apis: ['./routes/*.js', './routes/users.js', './routes/products.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Ruta de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Using product and user routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/', indexRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('Swagger UI available at http://localhost:3000/api-docs');
});
