const Product = require('../models/product');
const mongoose = require('mongoose');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                message: 'Required fields are missing',
                requiredFields: {
                    name: !name && 'Requested',
                    description: !description && 'Requested',
                    price: !price && 'Requested',
                    category: !category && 'Requested',
                    stock: !stock && 'Requested'
                }
            });
        }

        const product = new Product({
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock)
        });

        await product.save();
        
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ 
            message: 'Validation error',
            error: error.message,
            validationErrors: error.errors
        });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { name, price } = req.body;

    // Data validation
    if (!name || !price) {
        return res.status(400).json({ message: 'Name and price are required' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const product = await Product.findByIdAndUpdate(req.params.id, { name, price }, {
            new: true,
            runValidators: true
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};
