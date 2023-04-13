import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { deepOrange, green } from '@mui/material/colors';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import './User.css';
import Button from '@mui/material/Button/Button';
import axios from 'axios';

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

  const [pressed, setPressed] = useState(true);
 
  const token = `Bearer ${sessionStorage.getItem("token")}`

  const handleClick = (Id:any) => {
    setPressed(!pressed); 
    pressed ? createRequest(Id) : deleteUser(Id)
  };

  async function createRequest(Id:any) {
    try {
     
      const { data, status } = await axios.post<any>('https://localhost:7019/FriendRequest',
        { friendId: Id.id },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token
          },
        },
      );
  
      //setCreatedId(JSON.stringify(data, null, 4));
  
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
       
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }
  
  async function deleteUser(Id: any) {
    try {
      // 👇️ const data: UpdateUserResponse
      const { data, status } = await axios.delete<any>(
        `https://localhost:7019/FriendRequest/${Id.id}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: token
          },
        },
      );
  
      console.log('response is: ', data);
  
      // 👇️ response status is: 204
      console.log('response status is: ', status);
  
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
        // 👇️ error: AxiosError<any, any>
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }


  return (
    <div style={{display: 'flex'}}>
      <Avatar sx={{ bgcolor: green[500],margin:2 }} variant="rounded" />
      <div className='user'>
      <p className='username'>{username}</p>
      <p className='name'>{name} {surname}</p>
      </div>
      <div className='addButton'>

      <Button onClick={() =>handleClick({id})} 
                    sx={{
                            borderRadius: 10,
                            margin: 1
                        }} 
                        variant="contained"
                        color={pressed ? 'success' : 'error'} 
                        disableRipple >
                           {pressed ? <PersonAddAlt1OutlinedIcon/> : <PersonAddAlt1RoundedIcon/>}
                           </Button>
      
      </div>
      
                                                        
    </div>
  )
}

export default User