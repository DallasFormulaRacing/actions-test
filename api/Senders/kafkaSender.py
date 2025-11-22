import datetime
import os
import random
import json
import time
from dotenv import load_dotenv
from kafka import KafkaProducer

load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092").split(",")
KAFKA_TOPIC = os.getenv("KAFKA_TOPIC", "my_topic")


def run():
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    print(f"Kafka Producer started")
    print(f"  Bootstrap Servers: {KAFKA_BOOTSTRAP_SERVERS}")
    print(f"  Topic: {KAFKA_TOPIC}\n")
    
    iteration = 0
    
    try:
        while True:
            current_time = datetime.datetime.utcnow().isoformat() + "Z"
            random_temp = 70 + random.random() * 30
            
            message_data = {
                "event": {
                    "event_type": "temp",
                    "data": [
                        {
                            "time": current_time,
                            "sensor_id": 51,
                            "data": random_temp,
                        }
                    ],
                }
            }
            
            # Send the message
            producer.send(KAFKA_TOPIC, value=message_data)
            # producer.flush()  # Ensure message is sent immediately
            
            iteration += 1
            print(f"Sent message {iteration}: temp={iteration}")
            
            # Wait before sending next message
            time.sleep(.1)
            
    except KeyboardInterrupt:
        print("\nStopping sender...")
    finally:
        producer.close()


if __name__ == "__main__":
    run()
