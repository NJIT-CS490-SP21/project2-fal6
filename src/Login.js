import { React, useRef } from 'react';
import './Login.css';

function Login(props) {
  const { socket } = props;
  const ref = useRef(null);
  const roomRef = useRef(null);
  function logIn(name, room) {
    console.log(room);
    props.func(true);
    socket.emit('login', { name });
  }
  return (
    <div>
      <h1>Enter your username:</h1>
      <input type="text" ref={ref} />
      <p />
      <select ref={roomRef}>
        <option value={1}>Room 1</option>
        <option value={2}>Room 2</option>
        <option value={3}>Room 3</option>
      </select>
      <button type="button" onClick={() => logIn(ref.current.value, roomRef.current.value)}>Log in</button>
    </div>
  );
}
export default Login;
