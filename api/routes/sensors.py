from flask import Blueprint, jsonify, request
from ..db.models import sensors as sensors_table, metrics as metrics_table, Session
from datetime import datetime

sensors = Blueprint('sensors', __name__)

@sensors.route("/sensors", methods=["GET"])
def get_sensors():
    session = Session()
    try:
        res = session.query(sensors_table).all()
        rows = [dict(zip(sensors_table.columns.keys(), row)) for row in res]
        return jsonify(rows)
    finally:
        session.close()

@sensors.route("/sensors/<string:sensor_id>/metrics", methods=["GET"])
def get_sensor_metrics(sensor_id):
    session = Session()
    try:
        rows = session.query(metrics_table).filter_by(sensor_name=sensor_id).limit(50).all()
        if not rows:
            return jsonify({"error": "Sensor not found"}), 404
        results = [dict(row._mapping) for row in rows]
        return jsonify(results)
    finally:
        session.close()
