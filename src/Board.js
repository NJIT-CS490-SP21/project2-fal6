import React from 'react';
import './Board.css';
import {Box} from './Boxes.js';
import { useState, useEffect} from 'react';
import {Spectator} from './Spectator.js';
import {Reset} from './Reset.js';

export function Board(props){
    
    const [board, setBoard] = useState(Array(3).fill(Array(3).fill(null)));
    const [turn,setTurn] = useState(0);
    const [players,setPlayers] = useState([]);
    const [game,setGame] = useState(false);
    const [player,setPlayer] = useState({});
    const [win,setWin] = useState(false);
    const [playerids,setIds] = useState([]);
    const [spectators,setSpectators] = useState([]);
    const socket = props.socket;
    const [draw,setDraw] = useState(false);

    
    function checkWin(){
        const lines = [
            [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]],
            [[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]],
            [[0,1],[1,1],[2,1]],
            [[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]],
            [[2,0],[1,1],[0,2]],
        ]; //All possible wins
        for(let i=0;i<8;i++){
            const [a,b,c] = lines[i];
            if(board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]]===board[c[0]][c[1]])
                return board[a[0]][a[1]];
        }
        return null;
    }//Checks if the player has won
    function checkDraw(){
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(board[i][j]===null && !win){
                    return false;
                }
            }
        }
        return true;
    }
    useEffect(() => {
        socket.on('click', (data) => {
            setBoard((prevBoard)=>{
                return prevBoard.map((x,y)=>{
                    if(y===data.message[0]){
                        return x.map((m,n)=>{
                        if(n===data.message[1]){
                            return data.shape;
                        }
                        else{
                            return m;
                        }
                        })
                    }
                    else{
                        return x
                    }
                })
            });
            setTurn(data.shape==='X'?1:0); 
        });
    }, []);//Updates all client boards when the server sends a click
    useEffect(()=>{
       socket.on('init',(data)=>{
            setTurn(data.turn);
            setBoard(data.board);
            setSpectators(data.spectators);
            setWin(data.win);
            setDraw(false);
        }) 
    },[]) //Initializes the state of the board
    useEffect(()=>{
        socket.on('game',(data)=>{
            setPlayers([Object.values(data.players[0])[0], Object.values(data.players[1])[0]]);
            setIds(data.ids);
            setGame(true);
            if(socket.id in data.players[0]){
                setPlayer(data.players[0][socket.id]);
            }
            else if(socket.id in data.players[1]){
                setPlayer(data.players[1][socket.id]);
            }

        })
    },[])//Starts a game when two players join
    useEffect(()=>{
        const val = checkWin();
        const draw = checkDraw();
        if(val!==null){
            setWin(true);
        };
        if(draw!==false){
            setWin(true);
            setDraw(true);
        }
    },[board])//Checks if the user wins
    
    useEffect(()=>{
        socket.on('spectator',(data)=>{
            setSpectators(data.spectators);
        })
    },[])

    //Called when the user clicks a box
    function onClickEvent(indx){
        if(board[indx[0]][indx[1]]!=null || socket.id!=playerids[+turn]||win)
            return;
        setBoard((prevBoard)=>{
                return prevBoard.map((x,y)=>{
                    if(y===indx[0]){
                        return x.map((m,n)=>{
                        if(n===indx[1]){
                            if(+turn===0)
                                return 'X';
                            else
                                return 'O';
                        }
                        else{
                            return m;
                        }
                        })
                    }
                    else{
                        return x
                    }
                })
            }
        );
        let shape = '';
        if(+turn===0){
            setTurn(1);
            shape = 'X';
        }
        else{
            setTurn(0);
            shape = 'O';
        }
        socket.emit('click', {message: indx,shape:shape,});
    }
    const boxes=[]; 
    for (var i = 0;i<3;i++ ){
        for(var j =0;j<3;j++){
            boxes.push(<Box key={[i,j]} val={board[i][j]} index={[i,j]} func={onClickEvent} />)
        };
    }// Creates all of the board boxes
    return(
        <div>
        {win && <Reset socket={socket}/>}
        <p>{game?
            players[0]+" vs "+players[1]:
            "Be ready"}</p>
        {win?
        (<p>{draw?"Draw":players[+!turn]+" Wins!!!"}</p>):
            <p>{game?("Current Player: "+players[+turn]):"Waiting on Player 2..."}</p>}
            <div className="board">
              {boxes}
            </div>
            <Spectator spectators={spectators} />
        </div>
    );
}