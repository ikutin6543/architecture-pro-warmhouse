const express = require('express');
const bodyParser = require('body-parser');
const {pool, insertTelemetryValue, getAllSensors, initializeDatabase} = require('./db');
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const app = express();
const router = express.Router();
const PORT = 3001;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

initializeDatabase()

router.use(bodyParser.json());
// Обработчик входящих сообщений
server.on('message', async (msg, rinfo) => {
    try {
        const message = msg.toString();
        console.log(`Received from ${rinfo.address}:${rinfo.port}: ${message}`);

        const payload = JSON.parse(message)

        await insertTelemetryValue(payload.sensorId, payload.value);

    } catch (err) {
        console.error('Error processing message:', err);
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.bind(41234);

router.get('/sensor/:id', async (req, res) => {
    const sensorId = req.params.id;

    try {
        const result = await pool.query(
            'SELECT * FROM telemetry WHERE "sensorId" = $1 ORDER BY timestamp DESC LIMIT 1',
            [sensorId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Sensor not found'});
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

function getRandomFloat(min, max) {
    const str = (Math.random() * (max - min) + min).toFixed(3);
    return parseFloat(str);
}

app.use('/api/v1', router);

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

   // имитация того что UDP сервер получает показания с датчиков
    while (true) {
        const sensors = await getAllSensors();

        for (let sensor of sensors) {
            const value = getRandomFloat(-20, 40)
            console.log(`получил показания со счетчика id:${sensor.id} value:${value}`);
            await insertTelemetryValue(sensor.id, value);
        }

        await sleep(1000)
    }
});
