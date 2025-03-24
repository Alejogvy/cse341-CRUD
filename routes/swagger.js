const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// Serve Swagger UI
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

// Users documentation
router.get('/api-docs/users', (req, res) => {
    res.json({
        message: 'Endpoints for Users',
        endpoints: [
            { method: 'POST', path: '/users', description: 'Create a new user' },
            { method: 'GET', path: '/users', description: 'Get all users' },
            { method: 'GET', path: '/users/:id', description: 'Get a user by ID' },
            { method: 'PUT', path: '/users/:id', description: 'Update a user by ID' },
            { method: 'DELETE', path: '/users/:id', description: 'Delete a user by ID' },
        ]
    });
});

module.exports = router;
