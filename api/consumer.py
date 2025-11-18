from kafka import KafkaConsumer
import threading
import json
import time

messages = [] # temp

def consumer():
  consumer = KafkaConsumer(
    'my_topic',
    bootstrap_servers=['localhost:9092'],
    auto_offset_reset='latest',
    enable_auto_commit=True,
    group_id='my-group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
  ) 

  print("Consumer starting...")
  for msg in consumer:
    print(f"Message: {msg.value}")
    messages.append(msg.value)

def start_consumer():
  thread = threading.Thread(target=consumer, daemon=True)
  thread.start()
  return thread
