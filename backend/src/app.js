const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static files from the "public/images" directory under the "/images" route
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Gobex Backend is running!');
});

const anaSayfaRoutes = require('./routes/anaSayfaRoutes');
app.use('/api/anasayfa', anaSayfaRoutes);

<<<<<<< HEAD
const galeriRoutes = require('./routes/galeriRoutes');
app.use('/api/galeri', galeriRoutes);

module.exports = app;
