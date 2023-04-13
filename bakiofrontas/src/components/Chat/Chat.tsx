import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { useParams } from 'react-router-dom';

interface Message {
  user: string;
  body: string;
}

const Chat: React.FC = () => {
    
  const userName = `${sessionStorage.getItem("name")}`;
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);

  const token = `Bearer ${sessionStorage.getItem("token")}`;

  useEffect(() => {
   
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7019/chatHub/?paramName1=${userName}`, {
      accessTokenFactory: () => token,
      
    })
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('ReceiveMessage', (user: string, body: string) => {
            console.log('Received message:', { user, body });
            setMessages((prevMessages) => [...prevMessages, { user, body}]);
          });
  
          
        })
        .catch((e) => console.log('Connection failed: ', e));
    }
  }, [connection]);

  const { id: roomID } = useParams<{ id: string | undefined }>();

  const joinRoom = async (roomIdToJoin: string) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      await connection.send('JoinUserRooms', roomIdToJoin);
      
      // Fetch messages after joining the room
      const fetchedMessages = await connection.invoke('LoadMessages', roomIdToJoin);
      setMessages(fetchedMessages);
    }
  };
  useEffect(() => {
    if (connection && roomID) {
      joinRoom(roomID);
      fetchMessages(roomID);
    }
  }, [connection, roomID]);

  const leaveRoom = async () => {
    if (connection && roomId && connection.state === signalR.HubConnectionState.Connected) {
      await connection.send('LeaveRoom', roomId);
      setRoomId(null);
    }
  };

  const sendMessage = async () => {
    if (input && connection && roomID && connection.state === signalR.HubConnectionState.Connected) {
      await connection.send('SendMessageToRoom', roomID, userName, input);
      setInput('');
    }
  };
  
  
  const fetchMessages = async (roomID: string) => {
    console.log('Getting Messages');
    console.log(connection);
    console.log(roomID);
    if (connection && roomID && connection.state === signalR.HubConnectionState.Connected) {
      const fetchedMessages = await connection.invoke('LoadMessages', roomID);
      console.log(fetchedMessages);
      setMessages(fetchedMessages);
    }
  };
 
 
  
  if (!roomID) {
    return <div>Please select a chat room</div>; // Or return a blank div: <div></div>
  }
  return (
    <>
 {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.user}:</strong> {message.body}
          </div>
        ))}
      

      <div style={{display:'flex'}}>
        <input
        style={{width:'100%'}}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
       
       
        
      </div>
    </>
  );
};

export default Chat;