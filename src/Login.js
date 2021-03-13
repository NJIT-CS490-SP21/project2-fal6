import { React, useRef } from 'react';
import './Login.css';
import PropTypes from 'prop-types';

function Login(props) {
  const { socket } = props;
  const ref = useRef(null);
  function logIn(name) {
    props.func(true);
    socket.emit('login', { name });
  }
  return (
    <div>
      <h1>Enter your username:</h1>
      <input type="text" ref={ref} />
      <button type="button" onClick={() => logIn(ref.current.value)}>Log in</button>
    </div>
  );
}
Login.propTypes = {
  socket: PropTypes.func.isRequired,
  func: PropTypes.func.isRequired,
};
export default Login;
