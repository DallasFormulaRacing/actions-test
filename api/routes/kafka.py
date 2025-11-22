from flask import Blueprint, Response
import threading
import queue
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.services.consumer import KafkaConsumerService

kafka_bp = Blueprint('kafka', __name__)

message_queue = queue.Queue()
consumer_started = False


def start_consumer():
    global consumer_started
    
    if consumer_started:
        return
    
    def on_message(data):
        message_queue.put(data)
    
    def run():
        consumer = KafkaConsumerService(on_message_callback=on_message)
        consumer.start()
    
    threading.Thread(target=run, daemon=True).start()
    consumer_started = True


@kafka_bp.route("/kafka/stream")
def stream():
    start_consumer()
    
    def generate():
        while True:
            data = message_queue.get()
            yield f"data: {json.dumps(data)}\n\n"
    
    response = Response(generate(), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['X-Accel-Buffering'] = 'no'
    return response
