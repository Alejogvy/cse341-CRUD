// routes/user.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Crear un nuevo usuario
router.post('/', async (req, res) => {
    const { name, email, password, role, isActive } = req.body;
    try {
        const newUser = new User({
            name,
            email,
            password,
            role,
            isActive
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
