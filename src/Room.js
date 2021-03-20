import React from 'react';

function Room(props) {
  const { socket } = props;
  return (
    <div>
      <button type="button" onClick={() => socket.emit('join')}>Go</button>
    </div>
  );
}
export default Room;
