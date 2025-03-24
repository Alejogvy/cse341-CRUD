const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger.json'); // Asegúrate de que sea un archivo válido
const connectDB = require('./data/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Default route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api', require('./routes'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
