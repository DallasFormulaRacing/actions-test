import asyncio
import datetime
import os
import random
import json
from dotenv import load_dotenv
load_dotenv()

from azure.eventhub import EventData
from azure.eventhub.aio import EventHubProducerClient

EVENT_HUB_CONNECTION_STR = os.getenv("EVENTSHUB_CONNECTION_STRING")
EVENT_HUB_NAME = os.getenv("EVENTSHUB_NAME")


async def run():
    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENT_HUB_CONNECTION_STR, eventhub_name=EVENT_HUB_NAME
    )
    
    async with producer:
        iteration = 0
        
        while True:
            # Create a new batch for this iteration
            event_data_batch = await producer.create_batch()
            
            # Add 5 events to the batch
            
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
            
            event_data_batch.add(EventData(json.dumps(message_data)))
            
            # Send the batch
            await producer.send_batch(event_data_batch)
            iteration += 1
            print(f"Sent batch {current_time}")
            
            # Wait before sending next batch
            await asyncio.sleep(1)


if __name__ == "__main__":
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        print("\nStopping sender...")
