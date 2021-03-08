import {React, useState,useEffect} from 'react';

export function Leaderboard(props){
    const socket = props.socket;
    const [showleadboard,setShowLeaderboard] = useState(false);
    const [leaderboard,setLeaderboard] = useState([]); // Leaderboard of users
    
    function displayBoard(leaderboard){
        console.log('here');
        if(!showleadboard){
            const new_board = leaderboard.map(
                (item)=><li key={item[0]}>{item[0]} {item[1]}</li>);
            setLeaderboard(new_board);
        }
        setShowLeaderboard((prev)=>!prev);
    }
    useEffect(()=>{
            socket.on("leaderboard",(data)=>{
                displayBoard(data.leaderboard);
            });
    },[]);
    return(
        <div>
            <button onClick={()=>socket.emit("leaderboard")}>{showleadboard?'Hide':'Leaderboard'}</button>
            {showleadboard && 
            (<div><h1>Leaderboard:</h1>
                <ol>
                    {leaderboard}
                </ol>
            </div>)
            }
        </div>
    )
}