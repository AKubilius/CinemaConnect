import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar/AppBar';
import Logo from '../../img/logo.svg'
import Logoo from '../../img/Logoo.png'
import { NavLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar/Avatar';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { NavBarRequests } from './NavBarRequests';
import { NavBarNotifications } from './NavBarNotifications';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from './Loading';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}



function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {

  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const [value, setValue] = useState(() => {
    switch (location.pathname) {
      case '/home':
        return 0;
      case '/movies':
        return 1;
       
      case '/chat':
        return 2;
      case '/recommendations':
        return 3;
      default:
        return 0;
    }
  });

  useEffect(() => {
    switch (location.pathname) {
      case '/home':
        setValue(0);
        break;
      case '/movies':
        setValue(1);
        break;
      case '/chat':
        setValue(2);
        break;
      case '/recommendations':
        setValue(3);
        break;
      default:
        setValue(0);
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);



  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setLoading(true);
    setValue(newValue);
  };


  return (
    <>
      {loading ? <Loading /> :
        <AppBar position="fixed" sx={{ bgcolor: 'white', top: -10 }}>
          <Container maxWidth="xl" >
            <Toolbar disableGutters sx={{ position: 'relative', justifyContent: 'space-between', }} >
              <Box sx={{

                marginTop: 1,
                display: 'flex',
                flexDirection: 'row'

              }}>
                <img style={{ marginTop: 5 }} height={45} src={Logoo}></img>
                <p style={{ color: 'black' }}>CineConnect</p>
              </Box>


              <Box sx={{ borderBottom: 1, borderColor: 'divider', alignSelf: 'flex-end' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <NavLink to="/home" style={{ textDecoration: 'none' }}>
                    <Tab disableRipple label="Srautas" {...a11yProps(0)} />
                  </NavLink>
                  <NavLink to="/movies" style={{ textDecoration: 'none' }}>
                    <Tab disableRipple label="Medija" {...a11yProps(1)} />
                  </NavLink>
                  <NavLink to="/chat" style={{ textDecoration: 'none' }}>
                    <Tab disableRipple label="Žinutės" {...a11yProps(2)} />
                  </NavLink>
                  <NavLink to="/recommendations" style={{ textDecoration: 'none' }}>
                    <Tab disableRipple label="Rekomendacijos" {...a11yProps(2)} />
                  </NavLink>
                </Tabs>

              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignContent: 'center', justifyContent: 'center', marginTop: 1 }}>


                <NavBarRequests />
                <NavBarNotifications />

                <Avatar src={`data:image/jpeg;base64,${sessionStorage.getItem("image")}`} ></Avatar>
              </Box>

            </Toolbar>

          </Container>
        </AppBar>
      }
    </>
  );
}