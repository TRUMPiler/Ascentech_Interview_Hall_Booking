const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const Booking = require('./models/Booking');
const Hall = require('./models/Halls');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/halls', async (req, res) => {
    try {
        const halls = await Hall.findAll();
        res.json(halls);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = await Booking.create(req.body);
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/bookings/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [updated] = await Booking.update(req.body, { where: { id: id } });
        if (updated) {
            const updatedBooking = await Booking.findOne({ where: { id: id } });
            res.json(updatedBooking);
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const deleted = await Booking.destroy({ where: { id: req.params.id } });
        if (deleted) {
            res.json({ message: 'Booking deleted' });
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        
        const hallCount = await Hall.count();
        if (hallCount === 0) {
            await Hall.bulkCreate([
                { name: 'Ascentech India Hall' },
                { name: 'Ram Mandir Hall Goregoan' },
                { name: 'Naishal Doshi Hall' },
                { name: 'Community Hall' },
                { name: 'Vivekananda Education Society Hall' }
            ]);
        }

        console.log(`Server running on port ${PORT}`);
        app.listen(PORT);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

startServer();