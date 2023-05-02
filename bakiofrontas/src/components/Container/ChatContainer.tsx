import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import { deepOrange, green } from '@mui/material/colors';
import Rating from '@mui/material/Rating';
import User from '../Users/User';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Posts from '../Post/Posts';
import { RightSideBar } from '../RightSideBar/RightSideBar';
import Users from '../Users/Users';
import UserSide from '../Users/UserSide';
import Collection from '../MoviesCollection/Collection';
import Movie from '../MoviesCollection/Movie';
import Collenction from '../MoviesCollection/Collection';
import Filter from '../Filter/Filter';
import { useParams } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';
import FriendsChat from '../Friends/FriendsChat';
import Chat from '../Chat/Chat';

interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
}

const ChatContainer: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const Url = "https://image.tmdb.org/t/p/original"
    const handleResults = (results: Movie[]) => {
        setMovies(results);
    };
    return (

        <>
            <CssBaseline />
            <Container maxWidth="xl" className='container' >
                <Box >
                    <Grid container spacing={2} sx={{ height: '80%' }}>
                        <Grid item xs={12} >
                            <Grid container justifyContent="center" spacing={1}>
                                <Grid key={1} item>

                                    <Paper
                                        sx={{
                                            height: '100%',
                                            position: 'relative',
                                            width: 350,
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                        }}>
                                        <aside>
                                            <FriendsChat/>
                                        </aside>
                                    </Paper>
                                </Grid>
                                <Grid key={2} item>
                                    <Paper
                                        sx={{
                                            position:'relative',
                                            height: 930,
                                            width: 600,
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                                overflowY: 'auto',
                                                '&::-webkit-scrollbar': {
                                                    width: '0.4em',
                                                  },
                                               
                                                 // Add this line to make it scrollable
                                        }}>
                                        <main style={{width: '100%', paddingBottom: '1rem'}}>
                                            <Chat/>
                                           
                                        </main>
                                       
                                    </Paper>
                                    <Box sx={{
                                                backgroundColor:'blue',
                                                position:'sticky'

                                            }}>
a
                                            </Box>
                                </Grid>
                                <Grid key={3} item>
                                    <Paper
                                        sx={{
                                            height: '100%',
                                            width: 350,
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
                                        }}>
                                        <aside>
                                            
                                        </aside>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
export default ChatContainer;