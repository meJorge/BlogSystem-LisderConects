require('dotenv').config();
const app       = require('./src/app');
const connectDB = require('./src/config/database');
const seedAdmin = require('./src/config/seedAdmin');
const { startScheduler } = require('./src/jobs/publishScheduler');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
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
