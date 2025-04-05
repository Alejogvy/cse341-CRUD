const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt'); // To encrypt the password

// Get all users
const getAll = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Hide password
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

// Get a user by ID
const getSingle = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('-password');
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

// Create user
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, favoriteColor, birthday } = req.body;
        
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: 'Campos requeridos faltantes',
                requiredFields: {
                    firstName: !firstName && 'Requerido',
                    lastName: !lastName && 'Requerido',
                    email: !email && 'Requerido',
                    password: !password && 'Requerido'
                },
                optionalFields: ['favoriteColor', 'birthday']
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            favoriteColor,
            birthday: birthday ? new Date(birthday) : null
        });

        await user.save();
        
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'El correo electrónico ya está registrado',
                error: 'EMAIL_EXISTS'
            });
        }
        res.status(500).json({ 
            message: 'Error del servidor',
            error: error.message 
        });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        
        // Flexible validation for update
        if (!firstName && !lastName && !email) {
            return res.status(400).json({ 
                message: 'At least one field is required',
                acceptableFields: ['firstName', 'lastName', 'email']
            });
        }

        const updates = {};
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (email) updates.email = email;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error',
            error: error.message 
        });
    }
};

// Delete a user by ID
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
