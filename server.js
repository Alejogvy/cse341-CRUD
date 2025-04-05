require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Nuevo: almacenamiento de sesiones
const passport = require('passport');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const isAuthenticated = require('./middleware/authenticate');
require('./config/passport');

// Importar rutas
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/users');

const app = express();

// Configuración de sesión dinámica por entorno
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true en producción
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
};

// Solo en producción usamos MongoDB para sesiones
if (process.env.NODE_ENV === 'production') {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60 // 1 día en segundos
  });
}

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://cse341-crud-uv92.onrender.com' 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// Headers CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, OPTIONS, DELETE");
  next();
});

// Rutas de autenticación (sin cambios)
app.get('/login', (req, res) => {
  res.send('<a href="/auth/github">Login con GitHub</a>');
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/github/callback', 
  passport.authenticate('github', { 
    failureRedirect: '/login',
    successRedirect: process.env.NODE_ENV === 'production'
      ? 'https://cse341-crud-uv92.onrender.com/api-docs'
      : '/api-docs'
  })
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Rutas principales (sin cambios)
app.get('/', (req, res) => {
  if (req.user) {
    const name = req.user.displayName || req.user.username;
    res.send(`Logged in as ${name}`);
  } else {
    res.send("Logged Out");
  }
});

app.get('/profile', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Configuración Swagger (sin cambios)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Docs',
      version: '1.0.0'
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas protegidas (sin cambios)
app.use('/api/products', isAuthenticated, productRoutes);
app.use('/api/users', isAuthenticated, userRoutes);
app.use('/', indexRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log('Modo:', process.env.NODE_ENV || 'development');
      console.log('Swagger UI:', `http://localhost:${port}/api-docs`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));