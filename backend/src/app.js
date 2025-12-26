const express = require('express');
const app = express();

app.use(express.json());

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Gobex Backend is running!');
});

const anaSayfaRoutes = require('./routes/anaSayfaRoutes');
app.use('/api/anasayfa', anaSayfaRoutes);

module.exports = app;
