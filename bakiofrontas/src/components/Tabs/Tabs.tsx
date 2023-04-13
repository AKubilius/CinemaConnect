import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar/AppBar';

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'white', top:-10 }}>
      <Container maxWidth="xl" >
        <Toolbar disableGutters sx={{position:'relative',justifyContent:'center'}} >


   
     <Box sx={{ borderBottom: 1, borderColor: 'divider', alignSelf:'flex-end' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab disableRipple label="Srautas" href='/home' {...a11yProps(0)} />
          <Tab disableRipple label="Media" href='/movies' {...a11yProps(1)} />
          <Tab disableRipple label="Pasiūlymai"  {...a11yProps(2)} />
        </Tabs>
      </Box>
      
   
    </Toolbar>
    </Container>
    </AppBar>
  );
}