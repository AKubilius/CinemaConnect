import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { deepOrange, green } from '@mui/material/colors';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import '../Users/User.css';
import Button from '@mui/material/Button/Button';
import axios from 'axios';
import Box from '@mui/material/Box/Box';
import { Link } from 'react-router-dom';

interface IUser {
  username: any;
  name: any;
  surname: any;
  id:any;
}


const User: React.FC<IUser> = ({
  username,
  name,
  surname,
  id
}) => {

const [roomId,setroomId] = useState<any>([]);
  const [pressed, setPressed] = useState(true);
 
  const token = `Bearer ${sessionStorage.getItem("token")}`

  const handleClick = (Id:any) => {
    setPressed(!pressed); 

  };


  const fetchComments = async () => {

    const { data } = await axios.get(`https://localhost:7019/api/Message/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token
        },
      })
      console.log(data)
      setroomId(data)


  }
  useEffect(() => {
    fetchComments()
  }, [])





  return (

<Link to={`/chat/${roomId}`} style={{ textDecoration: 'none', color: 'blue' }}>
     <Box sx={{
        '&:hover': {
            opacity: [0.9, 0.8, 0.7],
          }
     }}>
        
    <div style={{display: 'flex'}}>
      <Avatar sx={{ bgcolor: green[500],margin:2 }} variant="rounded" />
      <div className='user'>
      <p className='username'>{username}</p>
      <p className='name'>{name} {surname}</p>
      </div>                                              
    </div>
    </Box>
    </Link>

  )
}

export default User