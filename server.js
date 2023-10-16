const dotenv = require('dotenv');
const sequelize = require('./utils/db');

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'dev')
  dotenv.config({ path: './.env' });
else if (process.env.NODE_ENV === 'local')
  dotenv.config({ path: './.env.local' });


const User = require('./models/userModel');

// Sincroniza la base de datos
sequelize.sync({ force: false }) // Si "true", eliminará todas las tablas existentes y las volverá a crear
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