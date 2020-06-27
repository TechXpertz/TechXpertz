import React, { useState, useEffect } from 'react';
import InputBox from '../../InputBox';
import io from "socket.io-client";
import Message from './message';
import { useAuth0 } from "../../../react-auth0-spa";
const endpoint = "http://localhost:5000";

const Chat = () => {

  const [messages, setMessages] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const { getTokenSilently } = useAuth0();


  // useEffect(() => {

  //   try {

  //     getTokenSilently().then(tokenRes => {
  //       const socket = io(endpoint, {
  //         query: {
  //           token: tokenRes
  //         }
  //       });

  //       console.log(socket);
  //       socket.on("message", msg => {
  //         messages.push(msg);
  //         setMessages(Array(messages));
  //         console.log(msg);
  //       });

  //     });

  //   } catch (err) {
  //     console.log(err);
  //   }

  // }, [getTokenSilently]);

  return (
    <div>
      <h1>chat</h1>
      <button>Join room</button>
      <InputBox
        description='message'
        placeholder='message'
      />
      <button>Submit</button>
      {messages.map((message, index) =>
        <Message
          key={index}
          msg={message} />
      )}
    </div>
  );


};

export default Chat;