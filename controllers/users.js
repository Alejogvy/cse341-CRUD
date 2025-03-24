const User = require('../models/User'); // Asegúrate de tener el modelo User importado
const ObjectId = require('mongoose').Types.ObjectId; // Usamos Mongoose para la conversión de ObjectId

// Get all users
const getAll = async (req, res) => {
    try {
        const users = await User.find(); // Usamos el modelo User de Mongoose para obtener todos los usuarios
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

// Get a single user by ID
const getSingle = async (req, res) => {
    try {
        const userId = req.params.id; // El parámetro id es un string, no es necesario convertirlo a ObjectId manualmente
        const user = await User.findById(userId); // Usamos el método findById de Mongoose para encontrar el usuario por ID
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

// Create a new user
const createUser = async (req, res) => {
    try {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        });

        const response = await user.save(); // Usamos el método save() de Mongoose para guardar el usuario
        res.status(201).json({ message: 'User created', userId: response._id });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Update an existing user (excluding birthday)
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Extraemos los campos del usuario, excluyendo el cumpleaños
        const userUpdates = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor
        };

        const response = await User.findByIdAndUpdate(userId, userUpdates, { new: true }); // Usamos findByIdAndUpdate de Mongoose
        if (response) {
            res.status(200).json({ message: 'User updated', user: response });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const response = await User.findByIdAndDelete(userId); // Usamos findByIdAndDelete de Mongoose

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
