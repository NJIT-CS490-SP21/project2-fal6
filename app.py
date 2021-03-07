import os
from flask import Flask, send_from_directory, json, session,request
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv,find_dotenv

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

board = [[None,None,None] for i in range(3)] #Tic tac toe board
turn = False #Current player turn (0,X) (1, O)
players = [] # List of two current players
spectators = [] # List of spectators
valid_ids = [] # List of the two player Ids
game = False # Keeps track of if the game has started
win = False # Keeps track of if the user has won

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
    '''Clean up when a user disconnects'''
    global game
    global valid_ids
    global board
    global win
    if (request.sid in valid_ids): #If the user is a player, remove players
        players.clear() 
        spectators.clear()
        game = False
        win = False
        valid_ids.pop(valid_ids.index(request.sid))
        board = [[None,None,None] for i in range(3)]
    print('User disconnected!')
    print(valid_ids)

@socketio.on('reset')
def on_reset():
    '''Resets turn and board'''
    global turn 
    global win
    for i in range(len(board)):
        board[i] = [None,None,None]
    turn = 0
    win = False
    data = {'board':board,'turn':turn,'spectators':spectators,'win':win}
    socketio.emit("init",data,broadcast=True,include_self=True)

@socketio.on('login')
def on_login(data):
    '''Log user or spectator in'''
    global game
    if len(players) <2:
        players.append({request.sid:data["name"]})
        valid_ids.append(request.sid)
        print(players) 
    socketio.emit("init",{'board':board,'turn':turn,'spectators':spectators,'win':win},broadcast=False) #initializes board on connect
    if game:
        spectators.append(data["name"])
        socketio.emit("spectator",{"spectators":spectators})
    if len(players)==2:
        socketio.emit("game",{"players":players,"ids":valid_ids})
        game = True
    


@socketio.on("click")
def on_click(data):
    '''Updates board when a box is clicked'''
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