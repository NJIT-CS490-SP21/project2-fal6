import React, { useState, useEffect } from 'react';
import './Board.css';
import Box from './Boxes';
import Spectator from './Spectator';
import Reset from './Reset';
import Leaderboard from './Leaderboard';
import Room from './Room';

function Board(props) {
  const [board, setBoard] = useState(Array(3).fill(Array(3).fill(null))); // Tic tac toe board
  const [turn, setTurn] = useState(0); // current player turn (0,X) (1,O)
  const [players, setPlayers] = useState([]); // Name of two current players
  const [game, setGame] = useState(false); // Keeps track of if game has started
  const [win, setWin] = useState(false); // Keeps track of if game has ended or not
  const [playerids, setIds] = useState([]); // Keeps track of the id of the two active players
  const [spectators, setSpectators] = useState([]); // Keeps track of current list of spectators
  const { socket } = props; // web socket
  const [draw, setDraw] = useState(false); // Keeps track of if there was a draw or not

  function checkWin() {
    const lines = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [2, 0],
        [1, 1],
        [0, 2],
      ],
    ]; // All possible wins
    for (let i = 0; i < 8; i += 1) {
      const [a, b, c] = lines[i];
      if (
        board[a[0]][a[1]]
        && board[a[0]][a[1]] === board[b[0]][b[1]]
        && board[a[0]][a[1]] === board[c[0]][c[1]]
      ) return board[a[0]][a[1]];
    }
    return null;
  } // Checks if the player has won
  function checkDraw() {
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (board[i][j] === null && !win) {
          return false;
        }
      }
    }
    return true;
  } // Checks if there is a draw
  useEffect(() => {
    socket.on('click', (data) => {
      setBoard((prevBoard) => prevBoard.map((x, y) => {
        if (y === data.message[0]) {
          return x.map((m, n) => {
            if (n === data.message[1]) {
              return data.shape;
            }
            return m;
          });
        }
        return x;
      }));
      setTurn(data.shape === 'X' ? 1 : 0);
    });
  }, []); // Updates all client boards when the server sends a click
  useEffect(() => {
    socket.on('init', (data) => {
      setTurn(data.turn);
      setWin(data.win);
      setDraw(false);
      setBoard(data.board);
      setSpectators(data.spectators);
    });
  }, []); // Initializes the state of the board
  useEffect(() => {
    socket.on('game', (data) => {
      setPlayers([
        Object.values(data.players[0])[0],
        Object.values(data.players[1])[0],
      ]);
      setIds(data.ids);
      setGame(true);
      // if(socket.id in data.players[0]){
      //     setPlayer(data.players[0][socket.id]);
      // }
      // else if(socket.id in data.players[1]){
      //     setPlayer(data.players[1][socket.id]);
      // }
    });
  }, []); // Starts a game when two players join
  useEffect(() => {
    if (!win) {
      const val = checkWin();
      const drawcheck = checkDraw();
      if (val !== null) {
        setWin(true);
        if (socket.id === playerids[val === 'X' ? 0 : 1]) {
          socket.emit('win', { winner: val === 'X' ? 0 : 1 });
        }
      }
      if (drawcheck !== false) {
        setWin(true);
        setDraw(true);
      }
    }
  }, [board]); // Checks if the user wins

  useEffect(() => {
    socket.on('spectator', (data) => {
      setSpectators(data.spectators);
    });
  }, []); // Adds a spectator

  // Called when the user clicks a box
  function onClickEvent(indx) {
    if (board[indx[0]][indx[1]] != null || socket.id !== playerids[+turn] || win) return;
    setBoard((prevBoard) => prevBoard.map((x, y) => {
      if (y === indx[0]) {
        return x.map((m, n) => {
          if (n === indx[1]) {
            if (+turn === 0) return 'X';
            return 'O';
          }
          return m;
        });
      }
      return x;
    }));
    let shape = '';
    if (+turn === 0) {
      setTurn(1);
      shape = 'X';
    } else {
      setTurn(0);
      shape = 'O';
    }
    socket.emit('click', { message: indx, shape });
  }
  const boxes = [];
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      boxes.push(
        <Box
          key={[i, j]}
          val={board[i][j]}
          index={[i, j]}
          func={onClickEvent}
        />,
      );
    }
  } // Creates all of the board boxes
  return (
    <div>
      {win && <Reset socket={socket} valid={playerids} />}
      <h1>{game ? `${players[0]} vs ${players[1]}` : 'Be ready'}</h1>
      {win ? (
        <h2>{draw ? 'Draw' : `${players[+!turn]} Wins!!!`}</h2>
      ) : (
        <h2>
          {game
            ? `Current Player: ${players[+turn]}`
            : 'Waiting on Player 2...'}
        </h2>
      )}
      <div className="board">{boxes}</div>
      <Spectator spectators={spectators} />
      <Leaderboard socket={socket} />
      <Room socket={socket} />
    </div>
  );
}
export default Board;
