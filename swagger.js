const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'CRUD API - Products and Users',
        description: 'API for managing products and users',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['https'], // We switched to 'https' in production
    components: {
        securitySchemes: {
            sessionAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'connect.sid',
            },
        },
    },
    security: [{ sessionAuth: [] }],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/product.js', './routes/users.js', './routes/index.js'];

// Generate the swagger.json file
swaggerAutogen(outputFile, endpointsFiles, doc);
