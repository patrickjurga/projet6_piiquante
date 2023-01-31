const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user_routes');
const sauceRoutes = require('./routes/sauce_routes');

mongoose.connect('mongodb+srv://AdminP6:Password4mongodb@projet6.rz0m6gb.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    console.log('init ok');
    next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;