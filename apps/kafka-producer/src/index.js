const {Kafka} = require('kafkajs');
const express = require('express');
const bodyParser = require('body-parser');
const {managementCommand} = require("./kafka");

const app = express();
app.use(bodyParser.json());

const PORT = 3002;

app.post('/api/v1/command/sensor/:sensorId', async (req, res) => {
    try {
        const {sensorId} = req.params;
        const {command } = req.body;

        if ( !command) {
            return res.status(400).json({ error: 'command are required' });
        }

        await managementCommand(sensorId, command);
        res.json({ success: true, message: `Command ${command} sent to device ${sensorId}` });
    } catch (error) {
        console.error('Error executing command:', error);
        res.status(500).json({ error: 'Failed to execute command' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
