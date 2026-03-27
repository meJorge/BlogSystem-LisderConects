require('dotenv').config();
const app       = require('./src/app');
const connectDB = require('./src/config/database');
const seedAdmin = require('./src/config/seedAdmin');
const { startScheduler } = require('./src/jobs/publishScheduler');

// ✅ Usa la variable de entorno PORT que Railway proporciona
const port = process.env.PORT || 8080;  // 8080 solo como fallback

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

connectDB().then(async () => {
  await seedAdmin();
  startScheduler();
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
    console.log(`Blog público:  http://localhost:${PORT}`);
    console.log(`Panel admin:   http://localhost:${PORT}/admin`);
  });
});
