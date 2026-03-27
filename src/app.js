console.log('🚀 Iniciando aplicación...');
console.log('📂 Directorio actual:', __dirname);
console.log('📦 Módulos cargando...');

// Importa los módulos uno por uno para identificar dónde falla
try {
    console.log('✅ Cargando express...');
    const express = require('express');
    console.log('✅ Express cargado');
    
    console.log('✅ Cargando mongoose...');
    const mongoose = require('mongoose');
    console.log('✅ Mongoose cargado');
    
    // Tus otros imports...
    
    console.log('✅ Todos los módulos cargados');
    
    const app = express();
    const PORT = process.env.PORT || 3000;
    
    console.log('🚀 Iniciando servidor en puerto', PORT);
    
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    });
    
} catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
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
