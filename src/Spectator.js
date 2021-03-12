import { React, useRef } from "react";

export function Spectator(props) {
  const spectator = [];
  for (var i in props.spectators) {
    spectator.push(<li key={props.spectators[i]}>{props.spectators[i]}</li>);
  }
  return (
    <div>
      <p>Spectators:</p>
      <ul>{spectator}</ul>
    </div>
  );
}
