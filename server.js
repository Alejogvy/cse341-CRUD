require('dotenv').config();
const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const isAuthenticated = require('./middleware/authenticate');
require('./config/passport');

// Importing routes
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://cse341-crud-uv92.onrender.com',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: true,
      sameSite: 'none',
      domain: 'cse341-crud-uv92.onrender.com'
  },
  store: MongoStore.create({ 
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(passport.initialize());
app.use(passport.session());

// Explicit CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, OPTIONS, DELETE");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Authentication routes
app.get('/login', (req, res) => {
  res.send('<a href="/auth/github">Login con GitHub</a>');
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/github/callback', 
  passport.authenticate('github', { 
      failureRedirect: '/login',
      successRedirect: '/api-docs'
  })
);  

app.get('/logout', (req, res) => {
  req.logout(() => {
      res.redirect('/');
  });
});

// Parent path: Displays the name of the authenticated user
app.get('/', (req, res) => {
  if (req.session.user) {
    const name = req.session.user.displayName || req.session.user.username;
    res.send(`Logged in as ${name}`);
  } else {
    res.send("Logged Out");
  }
});

// Profile path to verify the session
app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Swagger Configuration
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

// Routes are protected and require authentication via the isAuthenticated middleware
app.use('/api/products', isAuthenticated, productRoutes);
app.use('/api/users', isAuthenticated, userRoutes);
app.use('/', indexRoutes);

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const port = 3000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log('Swagger UI available at http://localhost:3000/api-docs');
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
