const express  = require('express');
const path     = require('path');

const authRoutes     = require('./routes/authRoutes');
const postRoutes     = require('./routes/postRoutes');
const commentRoutes  = require('./routes/commentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth',       authRoutes);
app.use('/api/posts',      postRoutes);
app.use('/api/comments',   commentRoutes);
app.use('/api/categories', categoryRoutes);

// SPA fallback
app.get('/admin*', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno' });
});

module.exports = app;
