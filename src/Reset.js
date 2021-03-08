import {React} from 'react';

export function Reset(props){
    const socket = props.socket;
    function reset(){
        if(props.valid.includes(socket.id))
            socket.emit('reset',{'name':props.name});
    }
    return(
        <div>
                <button onClick={()=>reset()}>Play Again</button>  
        </div>
    );
}