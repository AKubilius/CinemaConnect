import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { blueGrey, red } from '@mui/material/colors';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import './User.css';
import Button from '@mui/material/Button';
import {makePostRequest, makeDeleteRequest} from "../Api/Api";

interface IUser {
  username: any;
  name: any;
  surname: any;
  id:any;
  image64:string;
}

const User: React.FC<IUser> = ({
  username,
  name,
  surname,
  image64,
  id
}) => {

  const [pressed, setPressed] = useState(true);

  const handleClick = (Id:any) => {
    setPressed(!pressed); 
    pressed ? createRequest(Id) : deleteUser(Id)
  };

  async function createRequest(Id:any) {
    return await makePostRequest('https://localhost:7019/FriendRequest', { friendId: Id.id });
    
  }
  
  async function deleteUser(Id: any) {
      return await makeDeleteRequest(`https://localhost:7019/FriendRequest/${Id.id}`);
  }

  const avatarSx = { bgcolor: blueGrey[900], margin: 2 };
  const pressedButtonSx = { bgcolor: blueGrey[900], margin: 2 };
  const errorButtonSx = { bgcolor: red[900], margin: 2 };

  return (
    <div style={{display: 'flex'}}>
      <Avatar src={`data:image/jpeg;base64,${image64}`} sx={avatarSx} variant="rounded" />
      <div className='user'>
        <p className='username'>{username}</p>
        <p className='name'>{name} {surname}</p>
      </div>
      <div className='addButton'>

        <Button
          onClick={() => handleClick({id})} 
          sx={pressed ? pressedButtonSx : errorButtonSx } 
          variant="contained"
        >
          {pressed ? <PersonAddAlt1OutlinedIcon/> : <PersonRemoveAlt1Icon/>}
        </Button>
      </div>
    </div>
  )
}

export default User