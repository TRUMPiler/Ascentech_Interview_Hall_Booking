const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    applicantName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobileNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hallName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    rent: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    additionalCharges: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    purposeOfUse: {
        type: DataTypes.STRING
    },
    remark: {
        type: DataTypes.TEXT
    },
    receiptNo: {
        type: DataTypes.STRING
    },
    receiptDate: {
        type: DataTypes.DATEONLY
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    }
});

Booking.sync({ alter: true });

module.exports = Booking;