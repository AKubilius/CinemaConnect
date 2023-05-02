import * as signalR from '@microsoft/signalr';
import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axios from "axios";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box/Box";
import TextField from "@mui/material/TextField/TextField";


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

const SendToFriend = (info: any) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const shareMovieInfo = () => {
    // Handle sharing the movie info here
    console.log("Movie info shared");
    handleClose();
  };
  const userName = `${sessionStorage.getItem("name")}`;
  const token = `Bearer ${sessionStorage.getItem("token")}`;
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [movieInfo, setMovieInfo] = useState<string | null>(null);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7019/chatHub/?paramName1=${userName}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
  
    setConnection(newConnection);
  }, []);


  const sendMovieInfo = async (userId: string) => {
    const response = await axios.get(`https://localhost:7019/api/message/${userId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const roomId = response.data;
    if (connection) {
    try {

      if (connection.state !== signalR.HubConnectionState.Connected) {
        await connection.start();
      }
      if (roomId) {
        await connection.invoke("JoinRoom", roomId.toString());

        if (connection && connection.state === signalR.HubConnectionState.Connected) {
         
          await connection.send("SendRequestToRoom", roomId.toString(), userName, `${info.movieId}`, true, userId, new Date());
        }
      } else {
        console.log("No common room found between the users.");
      }
    } catch (error) {
      console.log("Error sending movie info:", error);
    }}
  };

  return (
    <div>
      {/* Your movie description content here */}

      <Button
        sx={{
          borderRadius: 5,
          margin: 1,
        }}
        startIcon={<AddCircleIcon />}
        onClick={handleOpen}
        variant="text"
      >
        Pasidalinti
      </Button>
      <Dialog open={open} onClose={handleClose} >
        <DialogTitle>Share Movie</DialogTitle>
        <DialogContent >
          <TextField
            fullWidth
            id="outlined-multiline-static"
            label="Kometaras"
            multiline
            rows={4}
            sx={{
              marginTop: 2,
            }}
          />
          {info.friends?.map(
            (user: any | null, index: React.Key | null | undefined) => (
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                margin: 1,
                justifyContent: 'space-between'
              }}>
                <p style={{ margin: 0 }}>{user.userName}</p>
                <Button onClick={() => sendMovieInfo(user.id)}> Siusti</Button>
              </Box>

            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={shareMovieInfo}>Share</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SendToFriend;
