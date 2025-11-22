from kafka import KafkaConsumer
import json
import os
from dotenv import load_dotenv

load_dotenv()


class KafkaConsumerService:
    """
    Kafka Consumer Service - Designed for SSE integration
    Similar to EventHubConsumerService but for local Kafka
    """
    
    def __init__(self, on_message_callback=None):
        self.on_message_callback = on_message_callback
        self.topic = os.getenv("KAFKA_TOPIC", "my_topic")
        self.bootstrap_servers = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092").split(",")
        self.group_id = os.getenv("KAFKA_GROUP_ID", "my-group")
        
    def start(self):
        """
        Start consuming messages from Kafka.
        Expected message format:
        {
            'event': {
                'event_type': 'temp',
                'data': [
                    {
                        'time': '2025-11-18T22:11:11.574241+00:00Z',
                        'sensor_id': 1,
                        'data': 80.44
                    }
                ]
            }
        }
        """
        print(f"Starting Kafka consumer...")
        print(f"   Topic: {self.topic}")
        print(f"   Bootstrap Servers: {self.bootstrap_servers}")
        print(f"   Group ID: {self.group_id}")
        
        consumer = KafkaConsumer(
            self.topic,
            bootstrap_servers=self.bootstrap_servers,
            auto_offset_reset='latest',
            enable_auto_commit=True,
            group_id=self.group_id,
            value_deserializer=lambda x: json.loads(x.decode('utf-8'))
        )
        
        print("Kafka consumer connected and listening...")
        
        for msg in consumer:
            try:
                data = msg.value
                
                # Log receipt
                event_type = data.get('event', {}).get('event_type', 'unknown')
                print(f"Received '{event_type}' event from topic {self.topic}")
                
                # Call the user-provided callback if set
                if self.on_message_callback:
                    self.on_message_callback(data)
                else:
                    # Fallback: just print if no callback provided
                    print(f"Data: {data}\n")
                    
            except json.JSONDecodeError as e:
                print(f"ERROR: Failed to parse Kafka message: {e}")
            except Exception as e:
                print(f"ERROR: Error processing Kafka message: {e}")


# Standalone mode for testing
def main():
    
    def print_message(data):
        event_info = data.get('event', {})
        event_type = event_info.get('event_type', 'unknown')
        event_data = event_info.get('data', [])
        
        print(f"\n{'='*50}")
        print(f"Event Type: {event_type}")
        if event_data:
            for item in event_data:
                print(f"  Sensor ID: {item.get('sensor_id')}")
                print(f"  Time: {item.get('time')}")
                print(f"  Value: {item.get('data')}")
        print(f"{'='*50}\n")
    
    # Create and start consumer with print callback
    consumer = KafkaConsumerService(on_message_callback=print_message)
    consumer.start()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nShutting down consumer...")