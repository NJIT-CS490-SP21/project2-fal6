'''
Backend using flask and websockets in order to update TicTacToe boards in real time.
FlaskSQLAlchemy is used to mange user data
'''
import os
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='./build/static')
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
import models

CORS_VAR = CORS(APP, resources={r"/*": {"origins": "*"}})
SOCKETIO = SocketIO(APP,
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


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    '''index'''
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    '''When a user connects'''
    print('User connected!')


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
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


def reset(board):
    '''Restarts turn, board and win variables'''
    global TURN
    global WIN
    for count, _ in enumerate(board):
        board[count] = [None, None, None]
    TURN = 0
    WIN = False
    return board, TURN, WIN
@SOCKETIO.on('reset')
def on_reset():
    '''Resets turn and board'''
    reset(BOARD)
    data = {
        'board': BOARD,
        'turn': TURN,
        'spectators': SPECTATORS,
        'win': WIN,
    }
    SOCKETIO.emit("init", data, broadcast=True, include_self=True)


def add_user(username):
    '''Adds a new user to the database'''
    new_user = models.Player(username=username, points=100)
    DB.session.add(new_user)
    DB.session.commit()
    return [i.username for i in models.Player.query.all()]

@SOCKETIO.on('login')
def on_login(data):
    '''Log user or spectator in'''
    global GAME
    if (DB.session.query(
            models.Player).filter_by(username=data["name"]).first()
            is not None):
        print("The user exists")
    else:
        print(add_user(data["name"]))
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
        SOCKETIO.emit("spectator", {"spectators": list(SPECTATORS.values())})
    if len(PLAYERS) == 2:
        SOCKETIO.emit("game", {"players": PLAYERS, "ids": VALID_IDS})
        GAME = True

def click(board, data):
    '''Updates global board variable to new board'''
    indx = data['message']
    global TURN
    TURN = not TURN
    board[indx[0]][indx[1]] = data['shape']
    return board, TURN

@SOCKETIO.on("click")
def on_click(data):
    '''Updates board when a box is clicked'''
    print(str(data))
    click(BOARD, data)
    SOCKETIO.emit("click", data, broadcast=True, include_self=False)


@SOCKETIO.on("win")
def on_win(data):
    '''Update database when user wins'''
    user = DB.session.query(models.Player).filter_by(
        username=PLAYERS[data["winner"]][VALID_IDS[data["winner"]]]).first()
    user.points += 1
    user2 = DB.session.query(
        models.Player).filter_by(username=PLAYERS[not data["winner"]][
            VALID_IDS[not data["winner"]]]).first()
    user2.points -= 1
    DB.session.commit()


def leader_board():
    '''Returns sorted list of users'''
    leaderboard = models.Player.query.all()
    leaderboard = list(
        map(lambda person: [person.username, person.points], leaderboard))
    leaderboard.sort(key=lambda leaderboard: leaderboard[1], reverse=True)
    return leaderboard

@SOCKETIO.on("leaderboard")
def on_leaderboard():
    '''Returns a list of users and scores sorted from first to last'''
    leaderboard = leader_board()
    emit("leaderboard", {
        'leaderboard': leaderboard,
        'name': USERS[request.sid]
    })


# Note that we don't call APP.run anymore. We call socketio.run with APP arg
if __name__ == "__main__":
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
