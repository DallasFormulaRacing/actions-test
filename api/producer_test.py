from kafka import KafkaProducer
import json
import time
import datetime
import random

producer = KafkaProducer(
    bootstrap_servers=['localhost:9092'],
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)

i = 0
while True:

    current_time = datetime.datetime.utcnow().isoformat() + "Z"
    random_temp = 70 + random.random() * 30

    message_data = {
        "event": {
            "event_type": "temp",
            "data": [
                {
                    "time": current_time,
                    "sensor_id": 1,
                    "data": round(random_temp, 2),
                }
            ],
        }
    }
    

    producer.send('my_topic', value=message_data)
    print(f"Sent: {message_data['event']['event_type']}")
    time.sleep(1)
    i += 1

producer.flush()
producer.close()
print("Done")
