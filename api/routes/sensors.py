from flask import Blueprint, jsonify, request
from ..models import sensors as sensors_table, metrics as metrics_table, session
from datetime import datetime

sensors = Blueprint('sensors', __name__)

@sensors.route("/sensors", methods=["GET"])
def get_sensors():
    res = session.query(sensors_table).filter_by(active=False).all() # Change active=True
    rows = [dict(zip(sensors_table.columns.keys(), row)) for row in res]
    return jsonify(rows)

@sensors.route("/sensors/<int:sensor_id>/metrics", methods=["GET"])
def get_sensor_metrics(sensor_id):

    rows = session.query(metrics_table).filter_by(sensor_id=sensor_id).limit(50).all()

    if not rows:
        return jsonify({"error": "Sensor not found"}), 404

    results = [dict(row._mapping) for row in rows]
    return jsonify(results)
