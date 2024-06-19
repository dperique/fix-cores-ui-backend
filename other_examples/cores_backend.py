from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# use @cross_origin() decorator to enable CORS just for the http://just-hello.com origin
@app.route('/')
@cross_origin(origins="http://just-hello.com")
def hello_world():
    return 'Hello, world!'

@app.route('/api/users', methods=['GET'])
@cross_origin(origins="http://just-users.com")
def get_users():
    users = ["User1", "User2", "User3"]
    return jsonify(users)

if __name__ == '__main__':
    app.run(port=8080)