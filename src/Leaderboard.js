import { React, useState, useEffect } from "react";
import "./Table.css";
export function Leaderboard(props) {
  const socket = props.socket;
  const [showleadboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // Leaderboard of users

  function displayBoard(name, leaderboard) {
    if (!showleadboard) {
      const new_board = leaderboard.map((item) => {
        if (item[0] === name) {
          return (
            <tr style={{ color: "blue" }} key={item[0]}>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
            </tr>
          );
        } else {
          return (
            <tr key={item[0]}>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
            </tr>
          );
        }
      });
      setLeaderboard(new_board);
    }
    setShowLeaderboard((prev) => !prev);
  } //Hide or display leaderboard
  useEffect(() => {
    socket.on("leaderboard", (data) => {
      displayBoard(data.name, data.leaderboard);
    });
  }, []); // When a leaderboard event happens
  return (
    <div>
      <button onClick={() => socket.emit("leaderboard")}>
        {showleadboard ? "Hide" : "Leaderboard"}
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
