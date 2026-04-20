from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
import jwt
import datetime

app = Flask(__name__)
app.config["SECRET_KEY"] = "campussaathi2026"
CORS(app)

client = MongoClient("mongodb+srv://Bishwajit:Campus2026@campussaathi.6hbjhby.mongodb.net/?tls=true&tlsAllowInvalidCertificates=true")
db = client["campussaathi"]

@app.route("/")
def home():
    return jsonify({"message": "Campus Saathi Backend Running!"})

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    if db.users.find_one({"college_id": data["college_id"]}):
        return jsonify({"error": "ID already registered!"}), 400
    hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
    db.users.insert_one({"name": data["name"], "college_id": data["college_id"], "password": hashed, "role": data["role"], "email": data["email"], "phone": data["phone"], "dept": data["dept"], "college": data["college"], "gender": data["gender"]})
    return jsonify({"message": "Account created!"})

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    user = db.users.find_one({"college_id": data["college_id"], "role": data["role"]})
    if not user or not bcrypt.checkpw(data["password"].encode(), user["password"]):
        return jsonify({"error": "Wrong ID or Password!"}), 401
    token = jwt.encode({"id": data["college_id"], "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)}, app.config["SECRET_KEY"])
    return jsonify({"token": token, "name": user["name"], "role": user["role"]})

@app.route("/api/rides", methods=["GET"])
def get_rides():
    rides = list(db.rides.find({}, {"_id": 0}))
    return jsonify(rides)

@app.route("/api/rides", methods=["POST"])
def post_ride():
    data = request.json
    db.rides.insert_one(data)
    return jsonify({"message": "Ride posted!"})

@app.route("/api/notices", methods=["GET"])
def get_notices():
    notices = list(db.notices.find({}, {"_id": 0}))
    return jsonify(notices)

@app.route("/api/notices", methods=["POST"])
def post_notice():
    data = request.json
    db.notices.insert_one(data)
    return jsonify({"message": "Notice posted!"})

@app.route("/api/lostandfound", methods=["GET"])
def get_lf():
    items = list(db.lostandfound.find({}, {"_id": 0}))
    return jsonify(items)

@app.route("/api/lostandfound", methods=["POST"])
def post_lf():
    data = request.json
    db.lostandfound.insert_one(data)
    return jsonify({"message": "Item posted!"})

@app.route("/api/events", methods=["GET"])
def get_events():
    events = list(db.events.find({}, {"_id": 0}))
    return jsonify(events)

@app.route("/api/events", methods=["POST"])
def post_event():
    data = request.json
    db.events.insert_one(data)
    return jsonify({"message": "Event posted!"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)