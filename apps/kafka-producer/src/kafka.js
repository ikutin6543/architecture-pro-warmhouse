const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'producer',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();
const managmentTopic = "management";

const managementCommand = async (sensorId, command, data = {}) => {
    await producer.connect();
    await producer.send({
        topic: managmentTopic,
        messages: [
            {
                value: JSON.stringify({
                    payload: {
                        action: "command",
                        sensorId,
                        command,
                        data
                    }
                })
            }
        ],
    });
}

module.exports = {
    managementCommand
}