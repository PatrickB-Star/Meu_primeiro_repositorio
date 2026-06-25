const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'junior' // junior, pleno ou senior
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = User;