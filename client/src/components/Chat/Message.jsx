import React from 'react';
import moment from 'moment';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDeleteMessageMutation } from '../../redux/api';
import './chat.css';
import '../../index.scss';
import { toast } from "react-toastify";

const Message = ({ message, name, userId, roomId, roomHost }) => {
  const [deleteMessage] = useDeleteMessageMutation();

  const handleDelete = async () => {
    try {
      const result = await deleteMessage({
        userId: userId,
        roomId: roomId,
        messageId: message._id,
      }).unwrap();
      
      if (result) {
        console.log('Message deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error(error.data?.message || 'Failed to delete message');
    }
  };

  let isSentByCurrentUser = message.senderId === userId;
  let canDelete = isSentByCurrentUser || roomHost === userId;

  const renderFile = (fileUrl) => {
    return <a href={fileUrl} target="_blank" rel="noopener noreferrer">{message.message}</a>;
  };

  return isSentByCurrentUser ? (
    <div className="row justify-content-end pl-5 message-container sent">
      <Tooltip title="Delete">
        <IconButton onClick={handleDelete} size="small" className="delete-icon">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <div className="rec d-flex flex-column align-items-end m-2 shadow p-2 border rounded w-auto">
        <div>
          <em className="m-1 flex-start fw-bold text-uppercase">{name}</em>
          <em className="m-1 flex-end" style={{ fontSize: '10px' }}>
            {moment(message.timestamp).format('DD/MM hh:mm')}
          </em>
        </div>
        {message.fileUrl ? (
          <div className="m-1">
            {renderFile(message.fileUrl)}
          </div>
        ) : (
          <h6 className="m-1">{message.message}</h6>
        )}
      </div>
    </div>
  ) : (
    <div className="row justify-content-start pl-5 message-container received">
      <div className="sen d-flex flex-column align-items-end my-2 shadow p-2 border rounded w-auto">
        <div>
          <em className="m-1 flex-start fw-bold text-uppercase">
            {message.sender}
          </em>
          <em className="m-1 flex-end" style={{ fontSize: '10px' }}>
            {moment(message.timestamp).format('DD/MM hh:mm')}
          </em>
        </div>
        {message.fileUrl ? (
          <div className="m-1">
            {renderFile(message.fileUrl)}
          </div>
        ) : (
          <h6 className="m-1">{message.message}</h6>
        )}
      </div>
      {canDelete && (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete} size="small" className="delete-icon">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default Message;
