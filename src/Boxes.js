import React from 'react';
import PropTypes from 'prop-types';

function Box(props) {
  const { val } = props;
  const { index } = props;
  const { func } = props;
  return (
    <div tabIndex={0} role="button" onClick={() => func(index)} onKeyDown={() => func(index)} className="box">
      {val}
    </div>
  );
}

Box.propTypes = {
  val: PropTypes.func.isRequired,
  index: PropTypes.func.isRequired,
  func: PropTypes.func.isRequired,
};
export default Box;
