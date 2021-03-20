import { React } from 'react';

function Reset(props) {
  const { socket } = props;
  function reset() {
    if (props.valid.includes(socket.id)) socket.emit('reset');
  }
  return (
    <div>
      <button type="button" onClick={() => reset()}>Play Again</button>
    </div>
  );
}

export default Reset;
