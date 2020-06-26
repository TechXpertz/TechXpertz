import React from 'react';
const Message = ({ msg }) => {
  console.log('message', msg)

  return (
    <p>{msg}</p>
  );

}

export default Message;