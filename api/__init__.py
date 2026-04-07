import sentry_sdk
import os

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0,
)

from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)

    from .routes.sensors import sensors
    app.register_blueprint(sensors)

    from .routes.eventhub import eventhub
    app.register_blueprint(eventhub)

    from .routes.kafka import kafka_bp
    app.register_blueprint(kafka_bp)

    return app

app = create_app()

# Small comment to see if workflow runs after adding new branch