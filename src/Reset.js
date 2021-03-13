import { React } from 'react';
import PropTypes from 'prop-types';

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
Reset.propTypes = {
  socket: PropTypes.func.isRequired,
  valid: PropTypes.func.isRequired,
};

export default Reset;
