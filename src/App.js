import {Board} from './Board.js';
import io from 'socket.io-client';
import {useState} from 'react';
import {Login} from './Login.js';

const socket = io();

function App() {
  const [logged,setLogin] = useState(false);
  return (
    <div>
      {logged? <Board socket={socket}/> : <Login func={setLogin} socket={socket}/>}
    </div>
  );
}

export default App;
