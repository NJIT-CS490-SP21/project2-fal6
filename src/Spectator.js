import { React } from 'react';
import PropTypes from 'prop-types';

function Spectator(props) {
  const spectator = [];
  const { spectators } = props;
  const keys = Object.keys(spectators);
  for (let i = 0; i < keys.length; i += 1) {
    spectator.push(<li key={keys[i]}>{keys[i]}</li>);
  }
  return (
    <div>
      <p>Spectators:</p>
      <ul>{spectator}</ul>
    </div>
  );
}
Spectator.propTypes = {
  spectators: PropTypes.func.isRequired,
};
export default Spectator;
