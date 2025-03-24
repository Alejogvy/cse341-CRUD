const express = require('express');
const { getAll, getSingle, createUser, updateUser, deleteUser } = require('../controllers/users');
const router = express.Router();

// Create a new user
router.post('/', createUser);

// Get all users
router.get('/', getAll);

// Get a user by ID
router.get('/:id', getSingle);

// Update a user by ID
router.put('/:id', updateUser);

// Delete a user by ID
router.delete('/:id', deleteUser);

module.exports = router;
