import Avatar from '@mui/material/Avatar/Avatar';
import Box from '@mui/material/Box/Box';
import { blueGrey } from '@mui/material/colors';
import React from 'react'

interface Comment {
    body: any;
    img: any;
    id:any;
  }
  
const Comments: React.FC<Comment> = ({
    body,
    img,
    id
}) => {
  return (
    <div style={{display:'flex'}}>
      <div style={{display:'flex',alignContent:'center', margin:10}}>
          <Avatar  
            sx={{ bgcolor: blueGrey[900], width: 30, height: 30 }}   
            src={`data:image/jpeg;base64,${img}`} 
          />
      </div>
      
      <Box sx={{ display:'grid', alignContent:'center', marginLeft:1 }} >
        {body}
      </Box>
    </div>
  )
}
export default Comments