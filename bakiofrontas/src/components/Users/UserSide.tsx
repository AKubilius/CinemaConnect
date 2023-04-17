import Avatar from '@mui/material/Avatar/Avatar'
import Box from '@mui/material/Box/Box'
import Users from './Users'

const UserSide = () => {
  const avatarSx = { margin: 2 };
  const boxSx = { borderBottom:1, display: 'flex'}

  return (
    <div className='userSide'>
        <Box sx={boxSx}>
            <Avatar src={`data:image/jpeg;base64,${sessionStorage.getItem("image")}`} sx={avatarSx} variant="rounded" />
            <h4>
              <a href={'/profile'} style={{ color:'white', textDecoration:'none'}}>{sessionStorage.getItem("name")}</a>
            </h4>
        </Box>

        <p>Siūlomi nariai</p>
           <Users/>
    </div>
  )
}

export default UserSide