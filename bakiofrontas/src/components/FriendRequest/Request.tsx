import Box from '@mui/material/Box/Box';
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import IconButton from '@mui/material/IconButton/IconButton';
import Typography from '@mui/material/Typography/Typography';
import axios from 'axios';

interface Request {
  username: any;
  id: any;
}


const Request: React.FC<Request> = ({
  username,
  id
}) => {


  const token = `Bearer ${sessionStorage.getItem("token")}`

  const handleClickAccept = (Id: any) => {
    acceptRequest(Id);
  };
  const handleClickDecline = (Id: any) => {
    deleteUser(Id)
  };


  async function acceptRequest(Id: any) {
    try {

      const { data, status } = await axios.post<any>(`https://localhost:7019/FriendRequest/accept/${Id.id}`,
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
      const { data, status } = await axios.delete<any>(`https://localhost:7019/FriendRequest/delete/${Id.id}`,
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
    <div>
      <Box sx={{ bgcolor: 'lightgrey', display: 'flex', borderRadius: 1, boxShadow: '0 4px 6px grey', width: '25vh', justifyContent: 'space-between', alignContent: 'center' }}>

        <Box sx={{ margin: 1, alignContent: 'center', display: 'flex' }}>
          <Typography>{username}</Typography>


        </Box>


        <Box sx={{ margin: 1 }}>
          <IconButton onClick={() => handleClickAccept({ id })}  >
            <CheckIcon sx={{
              color: 'green'
            }} />
          </IconButton>
          <IconButton onClick={() => handleClickDecline({ id })}
            sx={{

            }} >
            <DoDisturbIcon sx={{

              color: 'red'
            }} />
          </IconButton>
        </Box>

      </Box>

    </div>
  )
}

export default Request