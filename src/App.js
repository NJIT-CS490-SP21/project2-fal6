import {Board} from './Board.js';
import io from 'socket.io-client';

const socket = io();

function App() {
  return (
    <div className="board">
      <Board socket={socket}/>
    </div>
  );
}

export default App;
