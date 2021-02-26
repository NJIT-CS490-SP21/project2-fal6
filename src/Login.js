import React from 'react';

export function Login(props){
    const socket = props.socket;
    function logIn(name){
        props.func(true);
        socket.emit('login',{name:name})
    }
    return <button onClick={()=>logIn('Peter')}>Log in</button>
}