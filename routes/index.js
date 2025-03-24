const express = require('express');
const router = express.Router();

// Swagger route for API documentation
router.use('/', require('./swagger'));

// Default route to test the server
router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send('Hello World');
});

// Routes for product and user resources
router.use('/products', require('./product'));
router.use('/users', require('./users'));

module.exports = router;
