import Avatar from '@mui/material/Avatar/Avatar'
import Box from '@mui/material/Box/Box'
import React from 'react'
import Users from './Users'
import green from '@mui/material/colors/green'
import User from './User';

const UserSide = () => {


  
  return (
    <div className='userSide'>
    <Box >

        <Box sx={{ bgcolor: '#cfe8fc', display: 'flex', borderRadius: 2, marginBottom: 15, boxShadow: '0 4px 6px grey' }}>
            <Avatar sx={{ bgcolor: green[500], margin: 2 }} variant="rounded" />
            <p>{sessionStorage.getItem("name")}</p>
        </Box>
        <p>Siūlomi nariai</p>
        <Box sx={{ bgcolor: '#cfe8fc', borderRadius: 2, boxShadow: '0 4px 6px grey' }}>
           <Users/>
        </Box>
    </Box>
    </div>
  )
}

export default UserSide