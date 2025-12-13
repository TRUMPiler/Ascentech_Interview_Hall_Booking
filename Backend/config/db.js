const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


const caPath = path.join(__dirname, '..', 'ca.pem');


if (!fs.existsSync(caPath)) {
    console.error(`Error: Certificate file not found at ${caPath}`);
    process.exit(0);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
            ca: fs.readFileSync(caPath).toString()
        }
    }
});

module.exports = sequelize;