const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

// Create a new product
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getProducts);

// Update a product by ID
router.put('/:id', productController.updateProduct);

// Delete a product by ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
