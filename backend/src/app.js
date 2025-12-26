const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Gobex Backend is running!');
});

const anaSayfaRoutes = require('./routes/anaSayfaRoutes');
app.use('/api/anasayfa', anaSayfaRoutes);

module.exports = app;
