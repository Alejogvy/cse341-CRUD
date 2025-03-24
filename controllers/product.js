const Product = require('../models/product');
const mongoose = require('mongoose');

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        // Validar campos requeridos
        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        // Crear el nuevo producto
        const product = new Product(req.body);
        await product.save();

        // Respuesta exitosa
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
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
    try {
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Actualizar el producto
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,   // Devolver el documento actualizado
            runValidators: true  // Validar según el esquema
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Respuesta exitosa
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
        // Verificar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Eliminar el producto
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Respuesta exitosa
        res.status(204).send();  // No content after successful delete
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
