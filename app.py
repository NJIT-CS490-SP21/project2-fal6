import os
from flask import Flask, send_from_directory, json, session,request
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
users = {}
players = []
@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')
    

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    global players
    del users[request.sid]
    if len(players)!=0 and (request.sid in players[0] or request.sid in players[1]):
        players = []
    print('User disconnected!')
    print(users)

@socketio.on('reset')
def on_reset():
    global turn 
    for i in range(len(board)):
        board[i] = [None,None,None]
    turn = 'X'
    data = {'board':board,'turn':turn}
    socketio.emit("init",data,broadcast=True)

@socketio.on('login')
def on_login(data):
    users[request.sid]=data["name"]
    data_send = {'board':board,'turn':turn}
    print(users)
    if len(players) <2:
        players.append({request.sid:data["name"]})
        print(players) 
    socketio.emit("init",data_send,broadcast=False) #initializes board on connect
    if len(players)==2:
        socketio.emit("game",{"players":players})

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