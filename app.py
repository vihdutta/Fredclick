from flask import (Flask, render_template)
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import re

# Flask Setup
app = Flask(__name__)
app.secret_key = "SECRET"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///leaderboard.db"
db = SQLAlchemy(app)

# Database Setup
class Leaderboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# Main Page
@app.route('/', methods=["GET"])
def index():
    top5 = Leaderboard.query.order_by(Leaderboard.score.desc()).limit(5).all()
    return render_template("index.html", top5=top5)

@app.route('/api/<name>/<int:score>', methods=["GET"])
def update_leaderboard(name, score):
    # Sanitize input: Only allow alphabets, numbers, and underscores in the name
    sanitized_name = re.sub(r"[^\w]", "", name)
    
    new_score = Leaderboard(name=sanitized_name, score=score)
    db.session.add(new_score)
    db.session.commit()
    return "REQUEST SUCCESSFUL"

@app.route('/hello', methods=["GET"])
def hello():
    return render_template("hello.html")

@app.route('/clear', methods=["GET"])
def clear_database():
    db.drop_all()
    db.create_all()
    return "DATABASE CLEARED"

if __name__ == '__main__':
    app.run(debug=False, port=6969) #debug=True, port=6969
