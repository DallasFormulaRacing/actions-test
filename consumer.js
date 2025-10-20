const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:9092'],
});




const consumer = kafka.consumer({ groupId: 'test-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const obj = JSON.parse(message.value.toString());
    const dataobj = obj.event.data[0];
    const { time, sensor_id, data } = dataobj;

    
    if (sensor_id == 1) {
      console.error(`Time: ${time}\nSensor ID: ${sensor_id}\nData: ${data}\n\n`);
    }
    else{
        console.warn(`Time: ${time}\nSensor ID: ${sensor_id}\nData: ${data}\n\n`);
    }
  },
});
};

run().catch(console.error);