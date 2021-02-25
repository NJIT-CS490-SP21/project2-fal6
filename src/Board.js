import React from 'react';
import './Board.css';
import {Box} from './Boxes.js';
import { useState, useEffect} from 'react';


export function Board(props){
    
    const [board, setBoard] = useState(Array(3).fill(Array(3).fill(null)));
    const [turn,setTurn] = useState(0);
    const socket = props.socket;
    useEffect(() => {
        socket.on('click', (data) => {
            console.log('Click event received!');
            const board = data.board;
            let newBoard = board.map((row)=>row.slice());
            newBoard[data.message[0]][data.message[1]]=data.shape;
            setBoard(newBoard);
            setTurn(data.shape=='X'?1:0); //Replace with function
        });
    }, []);
    function onClickEvent(indx){
        if(board[indx[0]][indx[1]]!=null)
            return;
        let newBoard = board.map((row)=>row.slice())
        let shape="";
        if(turn==0){
            newBoard[indx[0]][indx[1]] = 'X';
            shape='X';
            setTurn(1);
        }
        else{
            newBoard[indx[0]][indx[1]] = 'O';
            shape='O';
            setTurn(0);
        }
        setBoard(newBoard);
        socket.emit('click', { message: indx,shape:shape,board:board });
    }
    const boxes=[]; 
    for (var i = 0;i<3;i++ ){
        for(var j =0;j<3;j++){
            boxes.push(<Box key={[i,j]} val={board[i][j]} index={[i,j]} func={onClickEvent} />)
        };
    }
    return(
        <div>
        <p>Current Player: {turn?'O':'X'}</p>
            <div className="board">
              {boxes}
            </div>
        </div>
    );
}