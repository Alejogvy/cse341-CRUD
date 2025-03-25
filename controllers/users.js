const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt'); // Para encriptar el password

// Obtener todos los usuarios
const getAll = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Ocultar password
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

// Obtener un usuario por ID
const getSingle = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('-password'); // Ocultar password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
    const { firstName, lastName, email, password, favoriteColor, birthday } = req.body;

    // Validación de datos
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields (firstName, lastName, email, password) are required.' });
    }

    try {
        // Hashear password antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Guardar password encriptado
            favoriteColor,
            birthday
        });

        const response = await user.save();
        res.status(201).json({ message: 'User created', userId: response._id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Actualizar un usuario (excluyendo el password)
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email, favoriteColor } = req.body;

    // Validación de datos
    if (!firstName && !lastName && !email && !favoriteColor) {
        return res.status(400).json({ message: 'At least one field must be provided for update.' });
    }

    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Verificar si el usuario existe antes de actualizar
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userUpdates = {
            firstName: firstName || existingUser.firstName,
            lastName: lastName || existingUser.lastName,
            email: email || existingUser.email,
            favoriteColor: favoriteColor || existingUser.favoriteColor
        };

        const updatedUser = await User.findByIdAndUpdate(userId, userUpdates, { new: true }).select('-password'); // Ocultar password
        res.status(200).json({ message: 'User updated', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Eliminar un usuario por ID
const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const response = await User.findByIdAndDelete(userId);

        if (response) {
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

module.exports = {
    getAll,
    getSingle,
    createUser,
    updateUser,
    deleteUser
};
