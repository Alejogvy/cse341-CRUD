const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CRUD API - Products',
        description: 'API to manage products and users',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'], // Only 'http' during development 
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/product.js', './routes/users.js'];

// This will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
