# Event Hub Consumer Service - Designed for WebSocket integration
import asyncio
from azure.eventhub.aio import EventHubConsumerClient
import os
import json
from dotenv import load_dotenv

load_dotenv()


class EventHubConsumerService:

    
    def __init__(self, on_message_callback=None):
        self.on_message_callback = on_message_callback
        self.connection_str = os.getenv("EVENTSHUB_CONSUMER_STRING")
        self.event_hub_name = os.getenv("EVENTSHUB_NAME")
        self.consumer_group = os.getenv("CONSUMER_GROUP", "carsensordashbaord")
        
        # Validate configuration
        if not self.connection_str:
            raise ValueError("EVENTSHUB_CONSUMER_STRING environment variable is required")
        if not self.event_hub_name:
            raise ValueError("EVENTSHUB_NAME environment variable is required")
    
    async def _on_event(self, partition_context, event):
        """        
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
        try:
            # Parse the event body
            data = json.loads(event.body_as_str())
            
            # Log receipt
            partition_id = partition_context.partition_id
            event_type = data.get('event', {}).get('event_type', 'unknown')
            print(f"Received '{event_type}' event from partition {partition_id}")
            
            # Call the user-provided callback if set
            if self.on_message_callback:
                await self.on_message_callback(data)
            else:
                # Fallback: just print if no callback provided
                print(f"Data: {data}\n")
            
            
        except json.JSONDecodeError as e:
            print(f"ERROR: Failed to parse Event Hub message: {e}")
        except Exception as e:
            print(f"ERROR: Error processing Event Hub message: {e}")
    
    async def start(self):

        print(f"Starting Event Hub consumer...")
        print(f"   Hub: {self.event_hub_name}")
        print(f"   Consumer Group: {self.consumer_group}")
        
        # Create Event Hub client
        client = EventHubConsumerClient.from_connection_string(
            conn_str=self.connection_str,
            consumer_group=self.consumer_group,
            eventhub_name=self.event_hub_name
        )
        
        # Start receiving messages
        async with client:
            print("Event Hub consumer connected and listening...")
            await client.receive(
                on_event=self._on_event,
                starting_position="@latest"  # Only new messages
            )
    



# Standalone mode for testing
async def main():
    
    async def print_message(data):
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
    consumer = EventHubConsumerService(on_message_callback=print_message)
    await consumer.start()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nShutting down consumer...")
