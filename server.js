const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config(); 

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI,)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Middleware to parse the body of requests
app.use(bodyParser.json());

// Import product routes
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/users');

// Using product routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});