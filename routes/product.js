const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Create a new product
router.post('/', async (req, res) => {
    const { name, category, price, stock, description } = req.body;
    try {
        const newProduct = new Product({
            name,
            category,
            price,
            stock,
            description
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
