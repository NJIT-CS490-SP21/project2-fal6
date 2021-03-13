import io from 'socket.io-client';
import React, { useState } from 'react';
import Board from './Board';
import Login from './Login';
import './App.css';

const socket = io();

function App() {
  const [logged, setLogin] = useState(false);
  return (
    <div className="app">
      {logged ? (
        <Board socket={socket} />
      ) : (
        <Login func={setLogin} socket={socket} />
      )}
    </div>
  );
}

export default App;
