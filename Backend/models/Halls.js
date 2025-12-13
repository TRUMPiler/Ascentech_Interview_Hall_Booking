const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Hall = sequelize.define('Hall', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Hall;