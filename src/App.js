import {Board} from './Board.js';
import io from 'socket.io-client';
import {useState} from 'react';

const socket = io();

function App() {
  const [logged,setLogIn] = useState(false);
  return (
    <Board socket={socket}/>
  );
}

export default App;
