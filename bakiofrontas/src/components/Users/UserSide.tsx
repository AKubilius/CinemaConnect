import Avatar from '@mui/material/Avatar/Avatar'
import Box from '@mui/material/Box/Box'
import Users from './Users'
import { blueGrey } from '@mui/material/colors'

const UserSide = () => {
  const avatarSx = { bgcolor: blueGrey[900], margin: 2 };

  return (
    <div className='userSide'>
        <Box sx={{ borderBottom:1, display: 'flex'}}>
            <Avatar src={`data:image/jpeg;base64,${sessionStorage.getItem("image")}`} sx={avatarSx} variant="rounded" />
            <p>
              <a href={'/profile'} style={{ color:'black', textDecoration:'none'}}>{sessionStorage.getItem("name")}</a>
            </p>
        </Box>

        <p>Siūlomi nariai</p>
           <Users/>
    </div>
  )
}

export default UserSide