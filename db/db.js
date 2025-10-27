
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,         // libros
  process.env.DB_USER,         // dev  (o root)
  process.env.DB_PASSWORD,     // devpass (o luf2110)
  {
    host: process.env.DB_HOST, // 127.0.0.1 (mejor que 'localhost' para MySQL)
    port: process.env.DB_PORT, // 3306
    dialect: 'mysql',          // con MariaDB funciona perfecto usando mysql2
    logging: false,
    // pool opcional:
    pool: { max: 5, min: 0, idle: 10000 }
  }
);

module.exports = sequelize;
