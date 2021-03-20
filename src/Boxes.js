import React from 'react';

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

export default Box;
