const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const path = require('path');
const session = require('express-session');
const helmet = require('helmet');
require("dotenv").config();
let securedPass = process.env.DB_PASS;
let cookiePass = process.env.COOKIE_PASS;

const app = express();

mongoose.connect(`mongodb+srv://LordKitetsu:${securedPass}@cluster0.l5dme.mongodb.net/<dbname>?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

mongoose.set('useCreateIndex', true);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.set('trust-proxy', 1); // Fais confiance au premier proxy
app.use(session({
  secret: cookiePass,
  cookie: { secure: true,
            httpOnly: true,
            domain: 'http://localhost:3000',
          },
  resave: true,
  saveUninitialized: false
  })
);

app.use(helmet());

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('api/auth', userRoutes);



module.exports = app; 