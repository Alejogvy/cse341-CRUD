const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HelloWorld
 *   description: A simple hello world route for testing
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Hello World endpoint
 *     tags: [HelloWorld]
 *     responses:
 *       200:
 *         description: A simple hello world message
 */
router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send('Hello World');
});

// Swagger route for API documentation
router.use('/swagger', require('./swagger'));

// Routes for product and user resources
router.use('/products', require('./product'));
router.use('/users', require('./users'));

// Eliminar esta línea porque no es necesario
// router.use('/index', require('./index'));

module.exports = router;
