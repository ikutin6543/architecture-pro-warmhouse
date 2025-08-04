const {Kafka} = require('kafkajs');

const kafka = new Kafka({
    clientId: 'consumer',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({groupId: 'group'});
const managmentTopic = "management";

async function run() {
    await consumer.connect();
    await consumer.subscribe({
        topic: managmentTopic,
        fromBeginning: true
    });
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const payload = JSON.parse(message.value.toString()).payload
            if(payload.action === "command") {
                console.log(`execute ${payload.command} the at device ${payload.sensorId}`)
            }
        },
    });
}

run().catch(console.error);