import {React} from 'react';

export function Reset(props){
    const socket = props.socket;
    function reset(){
        socket.emit('reset');
    }
    return(
        <div>
                <button onClick={()=>reset()}>Play Again</button>  
        </div>
    );
}