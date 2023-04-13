import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import Container from '@mui/material/Container';
import './Container.css'
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

export default function SimpleContainer() {
    const [value, setValue] = React.useState<number | null>(2);
    return (

       <>
            <CssBaseline />
            <Container maxWidth="xl" className='container' sx={{height:'auto'}}>
                <Box sx={{  height: 'auto'}}>

                    <Grid container spacing={2}  sx={{
                        height: '100%'

                    }}>
                        <Grid item xs={12} >
                            <Grid container justifyContent="center" spacing={1} sx={{
                        height: '100%'

                    }}>
                        
                                <Grid key={1} item>
                                    <Paper 
                                        sx={{
                                            height:'100%',
                                            position:'relative',                                       
                                            width: 350,
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                        }}
                                    >
                                        <aside>
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

                                        </aside>
                                    </Paper>
                                </Grid>
                                <Grid key={2} item>
                                    <Paper
                                        sx={{
                                            height: 1040,
                                            width: 600,
                                            
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                        }}
                                    >
                                         <main>
                                            <Posts/>
                                        </main>
                                    </Paper>


                                </Grid>
                                <Grid key={3} item>
                                    <Paper
                                        sx={{
                                            height:'100%',
                                            width: 350,
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                                        }}
                                    ><aside>
                                        <div> Pupolar</div>
                                          <RightSideBar/>



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