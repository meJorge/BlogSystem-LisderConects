// ============================================
// CONFIGURACIÓN INICIAL
// ============================================
console.log('🚀 Iniciando Blog System...');
console.log('📂 Directorio actual:', __dirname);

try {
    // Importar dependencias
    const express = require('express');
    const mongoose = require('mongoose');
    const path = require('path');
    const dotenv = require('dotenv');
    
    // Importar rutas
    const authRoutes = require('./routes/authRoutes');
    const postRoutes = require('./routes/postRoutes');
    const commentRoutes = require('./routes/commentRoutes');
    const categoryRoutes = require('./routes/categoryRoutes');
    
    console.log('✅ Todos los módulos cargados correctamente');
    
    // Cargar variables de entorno
    dotenv.config();
    
    // Inicializar app
    const app = express();
    
    // ============================================
    // MIDDLEWARES
    // ============================================
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, '..', 'public')));
    
    // ============================================
    // RUTAS DE LA API
    // ============================================
    app.use('/api/auth', authRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/categories', categoryRoutes);
    
    // ============================================
    // RUTAS DE PRUEBA Y SALUD
    // ============================================
    app.get('/', (req, res) => {
        res.json({
            status: 'online',
            message: 'Blog System funcionando en Railway 🚀',
            timestamp: new Date().toISOString(),
            endpoints: {
                auth: '/api/auth',
                posts: '/api/posts',
                comments: '/api/comments',
                categories: '/api/categories'
            }
        });
    });
    
    app.get('/api', (req, res) => {
        res.json({ 
            message: 'API Blog System funcionando',
            version: '1.0.0'
        });
    });
    
    app.get('/health', (req, res) => {
        res.status(200).json({ 
            status: 'ok', 
            uptime: process.uptime(),
            mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        });
    });
    
    // SPA fallback para rutas del admin
    app.get('/admin*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
    });
    
    // Fallback general para SPA
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });
    
    // Middleware de manejo de errores
    app.use((err, req, res, next) => {
        console.error('❌ Error:', err.stack);
        res.status(500).json({ 
            error: err.message || 'Error interno del servidor' 
        });
    });
    
    // ============================================
    // CONEXIÓN A MONGODB (si está configurado)
    // ============================================
    if (process.env.MONGODB_URI) {
        mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log('✅ MongoDB conectado correctamente'))
            .catch(err => console.error('❌ Error conectando a MongoDB:', err.message));
    } else {
        console.log('⚠️  No se configuró MONGODB_URI, la app funcionará sin base de datos');
    }
    
    // ============================================
    // INICIAR SERVIDOR - PARTE CRÍTICA
    // ============================================
    const PORT = process.env.PORT || 3000;
    
    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log('='.repeat(50));
        console.log(`✅ Blog System funcionando correctamente`);
        console.log(`📡 Puerto: ${PORT}`);
        console.log(`🌐 Host: 0.0.0.0`);
        console.log(`🕐 Iniciado: ${new Date().toISOString()}`);
        console.log(`🔗 URL: http://localhost:${PORT}`);
        console.log('='.repeat(50));
    });
    
    // Manejar errores del servidor
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
            console.error(`💡 Asegúrate de no tener otra instancia corriendo`);
        } else {
            console.error('❌ Error en el servidor:', error);
        }
    });
    
    // Manejar cierre graceful
    process.on('SIGTERM', () => {
        console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
        server.close(() => {
            console.log('✅ Servidor cerrado correctamente');
            mongoose.connection.close();
            process.exit(0);
        });
    });
    
    module.exports = app;
    
} catch (error) {
    console.error('❌ ERROR FATAL:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}