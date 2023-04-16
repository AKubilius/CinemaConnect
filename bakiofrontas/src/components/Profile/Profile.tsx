import Avatar from '@mui/material/Avatar/Avatar'
import Box from '@mui/material/Box/Box'
import green from '@mui/material/colors/green'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import axios from 'axios'

const style = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: 1,
  '&:hover': {

    opacity: [0.9, 0.8, 0.7],
  },
};


interface User {
  userName: any;
  name: any;
  surname: any;
  id: any;
  profileImageBase64: string;
}
export const Profile = () => {
  const [progress, setProgress] = useState(0);

  const token = `Bearer ${sessionStorage.getItem("token")}`
  const { userName } = useParams(); // Get the username parameter from the URL
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const getCompatibility = async () => {
    try {
      const { data: { compatibility } } = await axios.get(`https://localhost:7019/list/compatibility/${userName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token
          },
        })
      setProgress(compatibility)
      console.log(compatibility)
    }
    catch (error) {
      console.error('Bandant gaut Compability gautas error : ', error)
    }
  }
  useEffect(() => {
    if (!userName) {
      getLoggedInUser()
    }
    else {
      getCompatibility()
      getUserProfile()
    }
  }, [])



  const getLoggedInUser = async () => {
    try {
      const { data } = await axios.get(`https://localhost:7019/user/current`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token
          },
        })
      setCurrentUser(data);
      console.log(data)
    }

    catch (error) {
      console.error('Bandant gaut Compability gautas error : ', error)
    }
  }

  const getUserProfile = async () => {
    try {
      const { data } = await axios.get(`https://localhost:7019/user/${userName}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token
          },
        })
      setCurrentUser(data);
      console.log(data)
    }

    catch (error) {
      console.error('Bandant gaut Compability gautas error : ', error)
    }
  }




  const getProgressColor = () => {
    if (progress <= 30) {
      return 'red';
    } else if (progress <= 60) {
      return 'blue';
    } else {
      return 'green';
    }
  };


  return (
    <div className='userInfo'>

{currentUser ? (
      <Box sx={{ display: 'flex', borderRadius: 2, marginBottom: 15, boxShadow: '0 4px 6px lightgrey' }}>
        <Avatar src={`data:image/jpeg;base64,${currentUser.profileImageBase64}`} sx={{ margin: 5, height: 100, width: 100 }} variant="rounded" />
        <p style={{ fontSize: 25 }}>{currentUser.userName}</p>
      </Box>
 ) : (
  <div>Loading...</div>
)}
      {progress !== 0 && (
        <div>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              flexGrow: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getProgressColor(),
              },
            }}
          />
          <span style={{ marginLeft: '1rem' }}>{progress.toFixed(2)}%</span>
        </div>
      )}

      <Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Box
            sx={style}>
            <Link to={'/profile/list'} >Shares</Link>
          </Box>
          <Box sx={style}>
            <Link to={'/profile/list'} >List</Link>
          </Box>

        </Box>
      </Box>



    </div>
  )
}


