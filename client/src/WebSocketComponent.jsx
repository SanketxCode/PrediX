import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";


const WebSocketComponent  = () => {
    const [messages , setMessage] =  useState([]);

    const ws  = useRef(null);


    useEffect (()=>{

        ws.current =  new WebSocket('ws://localhost:8080');


        ws.current.onopen = () => {

            console.log('WebSocket connection established !');

            const subscribeMessage  = {
                action : 'subscribe',
                market_id : 101,
            };
            
             ws.current.send(JSON.stringify(subscribeMessage))
        };

    ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(' Recieved ',message);
        setMessage((prevMessages) => [...prevMessages,message]);
        
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };


     return () => {
      if (ws.current) {
        ws.current.close();
      }
    };

  }, []);
       
 
  return (
    <div>
      <h2>Real-Time Updates</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketComponent;