const Sequelize = require('sequelize');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'dev')
  dotenv.config({ path: './.env' });
else if (process.env.NODE_ENV === 'local')
  dotenv.config({ path: './.env.local' });

const sequelize = new Sequelize(process.env.DATABASE, {
  dialect: 'postgres',
  pool: {
    max: 20,
    min: 0
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

// setInterval(() => {
//   sequelize.query('SELECT 1');
//   sequelize.close();
// }, 6000);


module.exports = sequelize;
