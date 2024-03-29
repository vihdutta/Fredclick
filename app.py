from flask import (Flask, render_template)
from pymongo import MongoClient
from datetime import datetime, timezone
from dotenv import load_dotenv
import json
import os
import re

# Load environment variables
if os.path.exists(".env"):
    load_dotenv()

# Flask Setup
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

# MongoDB Atlas Connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database("leaderboard_db")

# Database Setup
class Leaderboard:
    def __init__(self):
        self.collection = db.leaderboard

    def insert_score(self, name, score):
        doc = {"name": name, "score": score, "date": datetime.now(timezone.utc)}
        self.collection.insert_one(doc)

    def get_top5(self):
        top5 = list(self.collection.find().sort("score", -1).limit(5))
        return top5

leaderboard = Leaderboard()

# Main Page
@app.route('/', methods=["GET"])
def index():
    top5 = leaderboard.get_top5()
    with open("vm_info.json", "r") as file:
        vm_info = json.load(file)
    return render_template("index.html", top5=top5, vm_info=vm_info)

@app.route('/api/<name>/<int:score>', methods=["GET"])
def update_leaderboard(name, score):
    # Sanitize input: Only allow alphabets, numbers, and underscores in the name
    sanitized_name = re.sub(r"[^\w]", "", name)[:15]
    
    leaderboard.insert_score(sanitized_name, score)
    return "REQUEST SUCCESSFUL"

@app.route('/hello', methods=["GET"])
def hello():
    return render_template("hello.html")

if __name__ == '__main__':
    app.run(debug=False, port=6969) #debug=True, port=6969
