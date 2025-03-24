const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CRUD API - Products and Users',
        description: 'API for managing products and users',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'], // Change to 'https' in production
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/product.js', './routes/users.js', './routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
