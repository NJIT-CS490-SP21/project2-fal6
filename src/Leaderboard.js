import { React, useState, useEffect } from 'react';
import './Table.css';
import PropTypes from 'prop-types';

function Leaderboard(props) {
  const { socket } = props;
  const [showleadboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // Leaderboard of users

  function displayBoard(name, board) {
    if (!showleadboard) {
      const newBoard = board.map((item) => {
        if (item[0] === name) {
          return (
            <tr style={{ color: 'blue' }} key={item[0]}>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
            </tr>
          );
        }
        return (
          <tr key={item[0]}>
            <td>{item[0]}</td>
            <td>{item[1]}</td>
          </tr>
        );
      });
      setLeaderboard(newBoard);
    }
    setShowLeaderboard((prev) => !prev);
  } // Hide or display leaderboard
  useEffect(() => {
    socket.on('leaderboard', (data) => {
      displayBoard(data.name, data.leaderboard);
    });
  }, []); // When a leaderboard event happens
  return (
    <div>
      <button type="button" onClick={() => socket.emit('leaderboard')}>
        {showleadboard ? 'Hide' : 'Leaderboard'}
      </button>
      {showleadboard && (
        <div>
          <h1>Leaderboard:</h1>
          <table className="table">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Points</th>
              </tr>
              {leaderboard}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

Leaderboard.propTypes = {
  socket: PropTypes.func.isRequired,
};
export default Leaderboard;
