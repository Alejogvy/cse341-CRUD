const User = require('../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

// Get all users
const getAll = async (req, res) => {
    try {
        const users = await User.find();
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
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
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
    const { firstName, lastName, email, favoriteColor, birthday } = req.body;

    // Data validation
    if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
        return res.status(400).json({ message: 'All fields (firstName, lastName, email, favoriteColor, birthday) are required.' });
    }

    try {
        const user = new User({
            firstName,
            lastName,
            email,
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

// Update an existing user (excluding birthday)
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email, favoriteColor } = req.body;

    // Data validation
    if (!firstName && !lastName && !email && !favoriteColor) {
        return res.status(400).json({ message: 'At least one field (firstName, lastName, email, favoriteColor) must be provided.' });
    }

    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const userUpdates = {
            firstName,
            lastName,
            email,
            favoriteColor
        };

        const response = await User.findByIdAndUpdate(userId, userUpdates, { new: true });
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
