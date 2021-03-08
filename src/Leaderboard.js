import {React, useState} from 'react';

export function Leaderboard(props){
    const socket = props.socket;
    const [showleadboard,setShowLeaderboard] = useState(false);
    const [leaderboard,setLeaderboard] = useState([]); // Leaderboard of users
    
    return(
        <div>
            {showleadboard && 
            (<div><h1>Leaderboard:</h1>
            <ol>
                {leaderboard}
            </ol></div>)
            }
        </div>
    )
}