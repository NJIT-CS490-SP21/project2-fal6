import {React,useRef} from 'react';

export function Login(props){
    const socket = props.socket;
    let ref = useRef(null);
    function logIn(name){
        props.func(true);
        socket.emit('login',{name:name})
    }
    return(
        <div>
                <input type="text" ref={ref}/>
                <button onClick={()=>logIn(ref.current.value)}>Log in</button>  
        </div>
    );
}