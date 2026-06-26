
const { Sequelize } = require('sequelize');
require('dotenv').config();
 


     const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Caminho onde o arquivo do banco será criado automaticamente
    logging: false
     });

module.exports = sequelize;