const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const result = await mongodb.getDatabase().db().collection('users').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = new ObjectId(req.params.id);
        const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
};

const createUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };
        const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
        if (response.acknowledged) {
            res.status(201).json({ message: 'User created', userId: response.insertedId });
        } else {
            res.status(500).json({ message: 'Error creating user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

const updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = new ObjectId(req.params.id);
        const user = {
            userName: req.body.userName,
            email: req.body.email,
            name: req.body.name,
            ipaddress: req.body.ipaddress
        };
        const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'User updated' });
        } else {
            res.status(500).json({ message: 'No changes made to the user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

const deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
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
