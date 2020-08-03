const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// Models
const User = require('./models/User');
const Article = require('./models/Article');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

// View Engine
app.set('view engine', 'ejs');

// Landing Page
app.get('/', async (req, res) => {
  try {
    const articles = await Article.find();
    res.render('index', { data: { articles: articles } });
  } catch (err) {
    console.error(err);
  }
});

// Import Routes
const loginRoute = require('./routes/login');
app.use('/login', loginRoute);

const signupRoute = require('./routes/signup');
app.use('/signup', signupRoute);

const logoutRoute = require('./routes/logout');
app.use('/logout', logoutRoute);

const homeRoute = require('./routes/home');
app.use('/home', homeRoute);

const settingsRoute = require('./routes/settings');
app.use('/settings', settingsRoute);

const adminRoute = require('./routes/admin');
app.use('/admin', adminRoute);

const emailRoute = require('./routes/email');
app.use('/email', emailRoute);

// DB connection
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Connected to DB!');
  }
);

// Port
app.listen(process.env.PORT || 3000);
