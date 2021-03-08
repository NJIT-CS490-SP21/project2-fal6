import {React,useRef} from 'react';
import './Login.css';

export function Login(props){
    const socket = props.socket;
    let ref = useRef(null);
    function logIn(name){
        props.func(true);
        socket.emit('login',{name:name})
    }
    return(
        <div>
                <h1>Enter your username:</h1>
                <input type="text" ref={ref}/>
                <button onClick={()=>logIn(ref.current.value)}>Log in</button>  
        </div>
    );
}