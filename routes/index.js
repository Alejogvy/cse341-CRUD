const express = require('express');
const router = express.Router();

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
    res.send('Hello World');
});

// Routes for products and users
router.use('/products', require('./product'));
router.use('/users', require('./users'));

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out the user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

module.exports = router;