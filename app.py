import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

board = [[None,None,None] for i in range(3)]
turn = False
users = []

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    data = {'board':board,'turn':turn}
    socketio.emit("init",data,) #initializes board on connect

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

@socketio.on('reset')
def on_reset():
    global turn 
    for i in range(len(board)):
        board[i] = [None,None,None]
    turn = 'X'
    data = {'board':board,'turn':turn}
    socketio.emit("init",data,)

@socketio.on('login')
def on_login(data):
    users.append(data['name'])
    print(users)

@socketio.on("click")
def on_click(data):
    print(str(data))
    global turn
    turn = not turn
    indx=data['message']
    board[indx[0]][indx[1]]=data['shape']
    socketio.emit("click",data,broadcast=True,include_self=False)

# Note that we don't call app.run anymore. We call socketio.run with app arg
socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)