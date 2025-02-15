import React, { useState, useEffect } from "react";
import Message from "./Message";
import "../../index.scss";

const Messages = ({ messages, name, userId, roomId, roomHost }) => {
  const [messageList, setMessageList] = useState(messages);

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  const handleDelete = (messageId) => {
    setMessageList(messageList.filter((message) => message._id !== messageId));
  };

  return (
    <div className="messages">
      {messageList.map((message, i) => (
        <div key={i}>
          <Message
            message={message}
            name={name}
            userId={userId}
            roomId={roomId}
            roomHost={roomHost}
            onDelete={handleDelete} // Pass the handleDelete callback
          />
        </div>
      ))}
    </div>
  );
};

export default Messages;
