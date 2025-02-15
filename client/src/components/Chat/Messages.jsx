import React from "react";
import Message from "./Message";
import "../../index.scss";

const Messages = ({ messages, name, userId, roomId, roomHost }) => {
  return (
    <div className="messages">
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} name={name} userId={userId} roomId={roomId} roomHost={roomHost} />
        </div>
      ))}
    </div>
  );
};

export default Messages;
