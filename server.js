const dotenv = require('dotenv');
const sequelize = require('./utils/db');
dotenv.config({ path: './.env' });

const User = require('./models/userModel');

// Sincroniza la base de datos
sequelize.sync({force: false}) // Si "true", eliminará todas las tablas existentes y las volverá a crear
  .then(() => {
    console.log('Tablas sincronizadas con éxito.');
  })
  .catch((err) => {
    console.error('Error al sincronizar tablas:', err);
  });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});