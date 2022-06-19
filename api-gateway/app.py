from flask import Flask, request
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_cors import CORS

import requests

API_SERVICE = "http://api-service:3000"

app = Flask(__name__)
limiter = Limiter(app, key_func=get_remote_address, default_limits=["10000 per hour"])
CORS(app)


@app.route("/")
@limiter.exempt
def index():
    return "API Gateway Index"


@app.route("/healthcheck")
@limiter.exempt
def healthcheck():
    return "OK"


@app.route("/shipment/<shipment_id>", methods=["GET"])
def get_shipment(shipment_id):
    r = requests.get(f"{API_SERVICE}/shipment/{shipment_id}")

    # TODO Error handling

    # TODO Translate into useful format:
    # - shipment_id
    # - address
    # - status
    # - rider
    # - location.lat
    # - location.long

    return r.json()


@app.route("/shipment", methods=["POST"])
def post_shipment():
    content = request.json
    r = requests.post(f"{API_SERVICE}/shipment", data=content)

    # TODO Error handling

    return r.json(), 201


@app.route("/shipment/<shipment_id>", methods=["PATCH"])
def patch_shipment(shipment_id):
    content = request.json
    r = requests.patch(f"{API_SERVICE}/shipment/{shipment_id}", data=content)

    # TODO Error handling

    return r.json(), 200
