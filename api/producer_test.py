from kafka import KafkaProducer
import json
import time

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)

i = 0
while True:
    message = {'number': i}
    producer.send('my_topic', value=message)
    print(f"Sent: {message}")
    time.sleep(1)
    i += 1

producer.flush()
producer.close()
print("Done")
