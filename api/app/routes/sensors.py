from flask import Blueprint, jsonify
from ..models import sensors as sensors_table, session

sensors = Blueprint('sensors', __name__)

@sensors.route("/sensors", methods=["GET"])
def get_sensors():
    res = session.query(sensors_table).all()
    rows = [dict(zip(sensors_table.columns.keys(), row)) for row in res]
    return jsonify(rows)
