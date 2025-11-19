from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.sensors import sensors
    app.register_blueprint(sensors)

    from .consumer import start_consumer
    start_consumer()

    from .routes.eventhub import eventhub
    app.register_blueprint(eventhub)

    return app

app = create_app()
