import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box/Box';
import TextField from '@mui/material/TextField/TextField';

const SendToFriend = (
    info:any
) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const shareMovieInfo = () => {
      // Handle sharing the movie info here
      console.log('Movie info shared');
      handleClose();
    };

  return (
    <div>
    {/* Your movie description content here */}

    <Button sx={{
                                    borderRadius: 5,
                                    margin: 1
                                }} startIcon={<AddCircleIcon />} onClick={handleOpen} variant="text">Pasidalinti</Button>
    <Dialog open={open} onClose={handleClose}>
        
      <DialogTitle>Share Movie</DialogTitle>
      <DialogContent>
      <TextField
          fullWidth
          id="outlined-multiline-static"
          label="Kometaras"
          multiline
          rows={4}
          sx={{
            marginTop:2,
          }}
        />
      {info.friends?.map((user: any | null, index: React.Key | null | undefined) => (
              <p>{user.userName}</p>
              ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={shareMovieInfo}>Share</Button>
      </DialogActions>
    </Dialog>
  </div>
  )
}

export default SendToFriend