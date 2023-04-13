import React from 'react'
import './Collection.css'
import { Box, Button } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import CreatePost from '../Post/CreatePost';

interface IPost {
    id: any;
    poster_path: any;
    createdDate: any;
    title: any;
    backdrop_path:any;

}


const Movie: React.FC<IPost> = ({
    id,
    poster_path,
    backdrop_path,
    createdDate,
    title



}) => {
    return (

        <div className='collection'>

            <Box >
                <Box sx={{ bgcolor: '#cfe8fc', display: 'flex', borderRadius: 2, width: '100%', boxShadow: '0 4px 6px grey' }}>
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

                            <a href={`/movie/${id}`}>{title}</a>

                            <Box sx={{ borderRadius: 2, marginBottom: 0, display: 'flex', flexDirection: 'flex', alignItems: 'end', justifyContent: 'left', marginTop: 15 }}>
                                <Button sx={{
                                    borderRadius: 5,
                                    margin: 1
                                }} startIcon={<AddCircleIcon />} variant="text">Pasidalinti</Button>
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
