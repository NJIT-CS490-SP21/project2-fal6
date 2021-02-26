import React from 'react';
import './Board.css';
import {Box} from './Boxes.js';
import { useState, useEffect} from 'react';


export function Board(props){
    
    const [board, setBoard] = useState(Array(3).fill(Array(3).fill(null)));
    const [turn,setTurn] = useState(0);
    const [category,setCategory] = useState("");
    const socket = props.socket;
    useEffect(() => {
        socket.on('click', (data) => {
            console.log('Click event received!');
            setBoard((prevBoard)=>{
                return prevBoard.map((x,y)=>{
                    if(y==data.message[0]){
                        return x.map((m,n)=>{
                        if(n==data.message[1]){
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
            setTurn(data.shape=='X'?1:0); 
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
            console.log(data.players)
            if(socket.id in data.players[0]){
                setCategory(data.players[0][socket.id]);
            }
            else if(socket.id in data.players[1]){
                setCategory(data.players[1][socket.id]);
            }
            else{
                setCategory("Spectator");
            }
        })
    },[])
    function onClickEvent(indx){
        console.log(socket.id);
        if(board[indx[0]][indx[1]]!=null)
            return;
        setBoard((prevBoard)=>{
                return prevBoard.map((x,y)=>{
                    if(y==indx[0]){
                        return x.map((m,n)=>{
                        if(n==indx[1]){
                            if(turn==0)
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
            });
        let shape = '';
        if(turn==0){
            setTurn(1);
            shape = 'X';
        }
        else{
            setTurn(0);
            shape = 'O';
        }
        socket.emit('click', { message: indx,shape:shape,});
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