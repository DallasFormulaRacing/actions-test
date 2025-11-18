# receiver.py
import asyncio
from azure.eventhub.aio import EventHubConsumerClient
import os
from dotenv import load_dotenv
load_dotenv()

CONNECTION_STR = os.getenv("EVENTSHUB_CONSUMER_STRING")
EVENT_HUB_NAME = os.getenv("EVENTSHUB_NAME")
CONSUMER_GROUP = "$Default"

async def on_event(partition_context, event):
    print(f"Received event from partition {partition_context.partition_id}: {event.body_as_str()}")
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
            starting_position="-1"  # "-1" reads from beginning
        )

if __name__ == "__main__":
    asyncio.run(main())
