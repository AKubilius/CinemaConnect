import React from 'react'
import More from '@mui/icons-material/MoreHoriz';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ShareIcon from '@mui/icons-material/Share';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { deepOrange, green } from '@mui/material/colors';
import Rating from '@mui/material/Rating';

import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './Post.css'

interface IPost {
    id: any;
    body: any;
    createdDate: any;
    imageUrl: any;
    movieId: any;
    
  }


  const Post: React.FC<IPost> = ({
    id,
    body,
    createdDate,
    imageUrl,
    movieId
  
  }) => {
    const [value, setValue] = React.useState<number | null>(2);
    return (
        <div className='post'>
            <Box sx={{ bgcolor: '#cfe8fc', borderRadius: 2, boxShadow: '0 4px 6px grey' }}>
                <Box sx={{ bgcolor: '#cfe8fc', display: 'flex' }}>
                    <Avatar sx={{ bgcolor: green[500], margin: 2 }} variant="rounded" />
                    <p> {body}</p>
                </Box>

                <Box
                    component="img"
                    sx={{
                        margin: 1,
                        borderRadius: 2,
                        height: 1,
                        width: '97%',

                    }}
                    alt="Movie"
                    src={`https://image.tmdb.org/t/p/original${imageUrl}`}
                />
                <Box>
                    <Rating sx={{
                        marginLeft: 1
                    }}
                        name="simple-controlled"
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                    />
                    <Box sx={{
                        marginLeft: 1,
                        marginRight: 1,
                        borderTop: 1,
                        borderColor: 'grey'
                    }}>
                        <Button sx={{
                            borderRadius: 5,
                            margin: 1
                        }} startIcon={<AddCircleIcon />} variant="text">Pasidalinti</Button>
                        <Button sx={{
                            borderRadius: 5,
                            margin: 1
                        }} startIcon={<AddCircleIcon />} variant="text">Pridėti</Button>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default Post