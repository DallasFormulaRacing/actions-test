# from azure.eventhub import EventHubProducerClient, EventData
# import os
# from dotenv import load_dotenv
# load_dotenv()

# CONNECTION_STR = os.getenv("EVENTSHUB_CONNECTION_STRING")
# EVENT_HUB_NAME = os.getenv("EVENTSHUB_NAME")
# def main():

#     print(CONNECTION_STR)
#     producer = EventHubProducerClient.from_connection_string(
#         conn_str=CONNECTION_STR,
#         eventhub_name=EVENT_HUB_NAME
#     )

#     # Create a batch
#     event_data_batch = producer.create_batch()
#     event_data_batch.add(EventData("Hello from Python!"))
#     event_data_batch.add(EventData("Second message"))

#     # Send
#     producer.send_batch(event_data_batch)
#     producer.close()
#     print("Sent events.")

# if __name__ == "__main__":
#     main()


import asyncio

import os
from dotenv import load_dotenv
load_dotenv()

from azure.eventhub import EventData
from azure.eventhub.aio import EventHubProducerClient

EVENT_HUB_CONNECTION_STR = os.getenv("EVENTSHUB_CONNECTION_STRING")
EVENT_HUB_NAME = os.getenv("EVENTSHUB_NAME")

async def run():
    # Create a producer client to send messages to the event hub.
    # Specify a connection string to your event hubs namespace and
    # the event hub name.
    producer = EventHubProducerClient.from_connection_string(
        conn_str=EVENT_HUB_CONNECTION_STR, eventhub_name=EVENT_HUB_NAME
    )
    async with producer:
        # Create a batch.
        event_data_batch = await   producer.create_batch()

        # Add events to the batch.
        for i in range(2):
            event_data_batch.add(EventData(f"event {i} "))
        
        # Send the batch of events to the event hub.
        await producer.send_batch(event_data_batch)

asyncio.run(run())