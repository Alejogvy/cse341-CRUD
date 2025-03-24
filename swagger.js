const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CRUD API - Products',
        description: 'API to manage products and users',
        version: '1.0.0'
    },
    host: 'localhost:3000',  // Cambiar el puerto si es necesario
    schemes: ['http'], // Solo 'http' durante desarrollo
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/product.js', './routes/users.js']; // Incluye todas las rutas necesarias

// This will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
