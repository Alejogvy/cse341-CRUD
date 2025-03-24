const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send('Hello World');
});

// Agregar la ruta de productos
router.use('/products', require('./product'));

router.use('/users', require('./users'));

module.exports = router;
