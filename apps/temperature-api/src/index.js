const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8081;

// Middleware to parse JSON requests
app.use(express.json());

// Temperature data class
class TemperatureData {
    constructor(value, unit, timestamp, location, status, sensorId, sensorType, description) {
        this.value = value;
        this.unit = unit;
        this.timestamp = timestamp;
        this.location = location;
        this.status = status;
        this.sensor_id = sensorId;
        this.sensor_type = sensorType;
        this.description = description;
    }
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    });
});

// Get temperature by location
app.get('/temperature', (req, res) => {
    const location = req.query.location;
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    // Generate random temperature data based on location
    const data = generateTemperatureData(location, '');

    res.status(200).json(data);
});

// Get temperature by sensor ID
app.get('/temperature/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ error: 'Sensor ID is required' });
    }

    // Generate random temperature data based on sensor ID
    const data = generateTemperatureData('', id);

    res.status(200).json(data);
});

// Generate temperature data
function generateTemperatureData(location, sensorId) {
    // Generate a random temperature between 18 and 28 degrees Celsius
    const randomOffset = Math.random() * 10; // 0-10
    const decimal = Math.random(); // 0-1
    const value = 18 + randomOffset + decimal;
    const roundedValue = Math.round(value * 100) / 100; // Round to 2 decimal places

    // If no location is provided, use a default based on sensor ID
    if (!location) {
        switch (sensorId) {
            case '1':
                location = 'Living Room';
                break;
            case '2':
                location = 'Bedroom';
                break;
            case '3':
                location = 'Kitchen';
                break;
            default:
                location = 'Unknown';
        }
    }

    // If no sensor ID is provided, generate one based on location
    if (!sensorId) {
        switch (location) {
            case 'Living Room':
                sensorId = '1';
                break;
            case 'Bedroom':
                sensorId = '2';
                break;
            case 'Kitchen':
                sensorId = '3';
                break;
            default:
                sensorId = '0';
        }
    }

    return new TemperatureData(
        roundedValue,
        '°C',
        new Date(),
        location,
        'active',
        sensorId,
        'temperature',
        `Temperature sensor in ${location}`
    );
}

// Start server
app.listen(PORT, () => {
    console.log(`Temperature API starting on :${PORT}`);
});