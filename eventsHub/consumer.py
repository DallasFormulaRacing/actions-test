# receiver.py
import asyncio
from azure.eventhub.aio import EventHubConsumerClient
import os
import json
from dotenv import load_dotenv
load_dotenv()



CONNECTION_STR = os.getenv("EVENTSHUB_CONSUMER_STRING")
EVENT_HUB_NAME = os.getenv("EVENTSHUB_NAME")
CONSUMER_GROUP = "carsensordashbaord"

async def on_event(partition_context, event):
    # Example json string;
    # {'event': {'event_type': 'temp', 'data': [{'time': '2025-11-18T22:11:11.574241+00:00Z', 'sensor_id': 1, 'data': 80.44}]}}
    data = json.loads(event.body_as_str())

    print(f"Received event from partition {partition_context.partition_id}\n")
    print(f"{data}\n\n")
    await partition_context.update_checkpoint(event)

async def main():
    client = EventHubConsumerClient.from_connection_string(
        conn_str=CONNECTION_STR,
        consumer_group=CONSUMER_GROUP,
        eventhub_name=EVENT_HUB_NAME
    )

    async with client:
        await client.receive(
            on_event=on_event,
            starting_position="@latest"
        )

if __name__ == "__main__":
    asyncio.run(main())
