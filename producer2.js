const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['localhost:9092'], // change if your Kafka broker is remote
});

const producer = kafka.producer();


const run = async () => {
    await producer.connect();
    let counter = 0;
    while (true) {
        const currentTime = new Date().toISOString(); // current time
        const randomTemp = 5000 + Math.random() * 10000; // random temp between 200 and 100

        const messageData = {
        event: {
            event_type: "rpm",
            data: [
            {
                time: currentTime,
                sensor_id: 2, // example id
                data: parseFloat(randomTemp.toFixed(2)), // limit to 2 decimal places
            }
            ]
        }
        };

        await producer.send({
        topic: 'test-topic',
        messages: [
            { value: JSON.stringify(messageData) },
        ],
        });

        console.log(`✅ Sent message ${counter} at ${currentTime}`);
        counter++;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};


run().catch(console.error);