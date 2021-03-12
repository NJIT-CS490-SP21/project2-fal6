import os
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
import models

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

BOARD = [[None, None, None] for i in range(3)]  #Tic tac toe board
TURN = False  #Current player turn (0,X) (1, O)
PLAYERS = []  # List of two current players
SPECTATORS = {}  # List of spectators
VALID_IDS = []  # List of the two player Ids
USERS = {}
GAME = False  # Keeps track of if the game has started
WIN = False  # Keeps track of if the user has won


@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    '''index'''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    '''When a user connects'''
    print('User connected!')


# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    '''Clean up when a user disconnects'''
    global GAME
    global VALID_IDS
    global BOARD
    global WIN
    global TURN
    if request.sid in VALID_IDS:  #If the user is a player, remove players
        PLAYERS.clear()
        SPECTATORS.clear()
        USERS.clear()
        GAME = False
        WIN = False
        TURN = False
        VALID_IDS.pop(VALID_IDS.index(request.sid))
        BOARD = [[None, None, None] for i in range(3)]
    print('User disconnected!')
    print(VALID_IDS)


@socketio.on('reset')
def on_reset():
    '''Resets turn and board'''
    global TURN
    global WIN
    for count,_ in enumerate(BOARD):
        BOARD[count] = [None, None, None]
    TURN = 0
    WIN = False
    data = {
        'board': BOARD,
        'turn': TURN,
        'spectators': SPECTATORS,
        'win': WIN,
    }
    socketio.emit("init", data, broadcast=True, include_self=True)


@socketio.on('login')
def on_login(data):
    '''Log user or spectator in'''
    global GAME
    if (db.session.query(
            models.Player).filter_by(username=data["name"]).first()
            is not None):
        print("The user exists")
    else:
        new_user = models.Player(username=data["name"], points=100)
        db.session.add(new_user)
        db.session.commit()
        print(models.Player.query.all())
    if len(PLAYERS) < 2:
        PLAYERS.append({request.sid: data["name"]})
        VALID_IDS.append(request.sid)
        print(PLAYERS)
    send_data = {
        'board': BOARD,
        'turn': TURN,
        'spectators': SPECTATORS,
        'win': WIN,
    }
    emit("init", send_data)  #initializes board on connect
    USERS[request.sid] = data["name"]
    if GAME:
        SPECTATORS[request.sid] = data["name"]
        socketio.emit("spectator", {"spectators": list(SPECTATORS.values())})
    if len(PLAYERS) == 2:
        socketio.emit("game", {"players": PLAYERS, "ids": VALID_IDS})
        GAME = True


@socketio.on("click")
def on_click(data):
    '''Updates board when a box is clicked'''
    print(str(data))
    global TURN
    TURN = not TURN
    indx = data['message']
    BOARD[indx[0]][indx[1]] = data['shape']
    socketio.emit("click", data, broadcast=True, include_self=False)


@socketio.on("win")
def on_win(data):
    '''Update database when user wins'''
    user = db.session.query(models.Player).filter_by(
        username=PLAYERS[data["winner"]][VALID_IDS[data["winner"]]]).first()
    user.points += 1
    user2 = db.session.query(
        models.Player).filter_by(username=PLAYERS[not data["winner"]][
            VALID_IDS[not data["winner"]]]).first()
    user2.points -= 1
    db.session.commit()


@socketio.on("leaderboard")
def on_leaderboard():
    '''Returns a list of users and scores sorted from first to last'''
    print(request.sid)
    leaderboard = models.Player.query.all()
    leaderboard = list(
        map(lambda person: [person.username, person.points], leaderboard))
    leaderboard.sort(key=lambda leaderboard: leaderboard[1], reverse=True)

    emit("leaderboard", {
        'leaderboard': leaderboard,
        'name': USERS[request.sid]
    })


# Note that we don't call app.run anymore. We call socketio.run with app arg
if __name__ == "__main__":
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
