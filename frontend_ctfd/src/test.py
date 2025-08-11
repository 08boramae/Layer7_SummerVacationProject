from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/api/scores')
def scores():
    users = [
        {"username": "swap", "score": 90},
        {"username": "boramae", "score": 75},
        {"username": "capybara", "score": 450},
        {"username":"Jihu", "score":350},
        {"username": "asdasd", "score":500},
        {"username":"leegayun","score":750},
        {"username":"leegayun222","score":900},
        {"username":"내이름은 김지후다 이새끼들아","score":1400}
    ]
    return jsonify(users)
@app.route('/api/challenges')
def challenges():
    challenges = [
        {"title":"xss1", "content":"Very hard xss", "file": "http://211.177.227.113:65302/", "points":1000, "field":"web", "link":"http://211.177.227.113:65302/"},
        {"title":"sql injection", "content":"Very Easy Sql injection", "file":"LINK", "points":1000, "field":"web"},
        {"title":"rop", "content":"rop me!!", "file": "LINK", "points":777, "field":"pwn"},
        {"title":"bof", "content":"Buffer Overflow", "file":"LINK", "points":800, "field":"pwn"},
        {"title":"crack me1", "content":"crack me please~", "file":"LINK", "points":500, "field":"rev"},
        {"title":"fix picture", "content":"simple forensic", "file":"LINK", "points":400, "field":"misc"}
    ]
    return jsonify(challenges)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)