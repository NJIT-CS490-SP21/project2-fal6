import React from 'react';
import './Board.css';
import {Box} from './Boxes.js';
import { useState, useEffect} from 'react';


export function Board(props){
    
    const [board, setBoard] = useState(Array(3).fill(Array(3).fill(null)));
    const [turn,setTurn] = useState(0);
    const [players,setPlayers] = useState([]);
    const [game,setGame] = useState(false);
    const [player,setPlayer] = useState("");
    const socket = props.socket;
    
    function checkWin(shape,indx){
        const lines = [
            [0,0],
            [0,2],
            [1,1],
            [2,0],
            [2,2],
        ];
        let diagonal = false;
        let horizontal = true;
        let vertical = true;
        let diagonal_perm = false;
        console.log(board);
        if (indx in lines){
            diagonal = true;
            diagonal_perm = true;
        }
        for(let i = 0;i<3;i++){
            if(horizontal && board[indx[0]][i] !== shape){ //Checks horizontal
                console.log("horizontal "+board[indx[0]][i]);
                console.log([indx[0],i]);
                horizontal = false;
            }
            if(vertical && board[i][indx[1]]!==shape){ //Checks vertical
                console.log("vertical "+board[i][indx[1]]);
                console.log([i,indx[1]]);
                vertical = false;
            }
            if(diagonal && board[i][i]!==shape){//Checks diagonal
                console.log("diagonal "+board[i][i]);
                console.log([i,i]);
                diagonal = false;
            }
            if(diagonal_perm && board[2-i][i]!==shape){
                console.log("diagonal_perm "+board[2-i][i]);
                console.log([2-i,i]);
                diagonal_perm = false;
            }
        }
        console.log(shape);
        console.log(diagonal+","+vertical+","+horizontal+","+diagonal_perm);
        return diagonal || vertical || horizontal||diagonal_perm;
    }
    
    useEffect(() => {
        socket.on('click', (data) => {
            console.log('Click event received!');
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
    }, []);
    useEffect(()=>{
       socket.on('init',(data)=>{
            setTurn(data.turn);
            setBoard(data.board);
        }) 
    },[]) //Initializes the state of the board
    useEffect(()=>{
        socket.on('game',(data)=>{
            setPlayers([Object.values(data.players[0])[0], Object.values(data.players[1])[0]]);
            setGame(true);
            if(socket.id in data.players[0]){
                setPlayer(data.players[0][socket.id]);
            }
            else if(socket.id in data.players[1]){
                setPlayer(data.players[1][socket.id]);
            }
        })
    },[])
    function onClickEvent(indx){
        if(board[indx[0]][indx[1]]!=null || player!=players[+turn])
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
            },console.log(checkWin((turn ?'O':'X'),indx)));
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
    }
    return(
        <div>
        <p>Current Player: {game?players[+turn]:(turn===0?'O':'X')}</p>
            <div className="board">
              {boxes}
            </div>
        </div>
    );
}