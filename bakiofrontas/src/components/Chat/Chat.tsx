import React, { useState, useEffect, useCallback, useRef  } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as signalR from '@microsoft/signalr';
import { useParams } from 'react-router-dom';
import './Chat.css'
import Box from '@mui/material/Box/Box';
import { ChatMovie } from './ChatMovie';

interface User{
  userName: string;
}
interface Movie {
  title: string;
  posterUrl: string;
}

interface Message {
  sender: User;
  body: string;
  image64: string;
  isMovie: boolean;
  movie?: Movie;
}

const Chat: React.FC = () => {
  
const userName = `${sessionStorage.getItem("name")}`;
const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState('');
const [roomId, setRoomId] = useState<string | null>(null);
const messagesEndRef = useRef<null | HTMLDivElement>(null);

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
        connection.on('ReceiveMessage', async (sender: User, body: string, image64: string, isMovie: boolean) => {
        
          setMessages((prevMessages) => [...prevMessages, { sender, body, image64, isMovie }]);
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
  if (connection && roomID && connection.state === signalR.HubConnectionState.Connected) {
    const fetchedMessages = await connection.invoke<Message[]>('LoadMessages', roomID);

    // Fetch movie data for movie messages
    const updatedMessages = await Promise.all(
      fetchedMessages.map(async (message) => {
        if (message.isMovie) {
          const movie = await fetchMovieData(message.body);
          return { ...message, movie };
        }
        return message;
      })
    );

    setMessages(updatedMessages);
  }
};

const fetchMovieData = async (movieId: any) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=c9154564bc2ba422e5e0dede6af7f89b&language=lt-LT`);
  const data = await response.json();
  return {
    title: data.title,
    posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
  };
};

const scrollToBottom = () => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
};

useEffect(() => {
  scrollToBottom();
}, [messages]);





if (!roomID) {
  return <div>Please select a chat room</div>; // Or return a blank div: <div></div>
}
return (
  <>
{messages.map((message, index) => (
     <div
     key={index}
     className={`message ${message.sender.userName === userName ? 'my-message' : 'other-message'}`}
   >
      {message.isMovie ? (
      <div className="message-content">
        <ChatMovie 
        title={message.movie?.title}
        Url={message.movie?.posterUrl}
        />
      </div>
    ) : (
      <div className="message-content">{message.body}</div>
      
    )}
    
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
    
  </>
);
};

export default  Chat;