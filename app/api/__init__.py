from flask import Flask
from flask_cors import CORS

def make_app():
  app = Flask("Sensor")

  CORS(app)

  from .routes.sensors import sensors
  app.register_blueprint(sensors)

  return app
