import {Board} from './Board.js';
import io from 'socket.io-client';
import {useState} from 'react';
import {Login} from './Login.js';
import './App.css';

const socket = io();

function App() {
  const [logged,setLogin] = useState(false);
  return (
    <div className="app">
      {logged? <Board socket={socket}/> : <Login func={setLogin} socket={socket}/>}
    </div>
  );
}
//Create Textbox with a button
//State that is a list of the texts
//onClick we would send the value of the textbox to the server socket.emit('chat')
//On the server listen for chat 
//socket.on('chat',(data)=>setChat((prevchat)=>[...prevchat,data.chat]))
//<ul>{chat}</ul>
export default App;
