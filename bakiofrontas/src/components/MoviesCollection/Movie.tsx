import React, { useEffect, useState } from 'react'
import './Collection.css'
import { Box, Button, Link } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import CreatePost from './CreatePost';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SendToFriend from './SendToFriend';

interface IPost {
    id: any;
    poster_path: any;
    createdDate: any;
    title: any;
    backdrop_path:any;
    friends:any[] | null; 
}

const Movie: React.FC<IPost> = ({
    id,
    poster_path,
    backdrop_path,
    createdDate,
    title,
    friends

}) => {
    return (
        <div className='collection'>
            <Box>
                <Box sx={{ display: 'flex', borderRadius: 2, width: '100%', border: 1 }}>
                    <div className='movies'>
                        <Box
                            component="img"
                            sx={{
                                margin: 1,
                                borderRadius: 2,
                                height: '90%',
                                width: '20%',
                            }}
                            alt="Movie"
                            src={`https://image.tmdb.org/t/p/original${poster_path}`}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, width: '100%', marginTop: 1 }}>

                            <Link href={`/movie/${id}`}>{title}</Link>

                            <Box sx={{ borderRadius: 2, marginBottom: 0, display: 'flex', flexDirection: 'flex', alignItems: 'end', justifyContent: 'left', marginTop: 15 }}>

                                <SendToFriend
                                friends={friends}
                                movieId={id}
                                imgUrl={backdrop_path}
                                body={title}
                                />
                                <CreatePost
                                
                                    movieId={id}
                                    imgUrl={backdrop_path}
                                    body={title}
                                />
                            </Box>
                        </Box>
                    </div>
                </Box>
            </Box>
        </div>
    )
}
export default Movie
