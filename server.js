const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Conectar a MongoDB (reemplaza con tu URL de conexión)
mongoose.connect('mongodb+srv://AlejogvyDB:Alejandro10.@cluster0.mnlrm.mongodb.net/crud', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.json());

// Importar las rutas de productos
const productRoutes = require('./routes/product'); // Verifica que la ruta sea correcta
const userRoutes = require('./routes/users');

// Usar las rutas de productos
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});