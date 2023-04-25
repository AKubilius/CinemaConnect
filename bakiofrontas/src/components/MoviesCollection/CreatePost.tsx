import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating/Rating";
import axios from "axios";
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
  border: 1
};

export default function BasicModal(movie: any) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [value, setValue] = React.useState<number | null>(0);
  const [comment, setComment] = useState('');

  const HandleSubmit = () => {
    setOpen(false);
    CreatePost();
  };

  const token = `Bearer ${sessionStorage.getItem("token")}`;
  
  const handleCommentChange = (event: { target: { value: any; }; }) => {
    setComment(event.target.value);
  };


  async function CreatePost() {
    try {
      const { data, status } = await axios.post<any>(
        "https://localhost:7019/Post",
        {
          body: comment,
          movieId: movie.movieId,
          imageUrl: movie.imgUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token,
          },
        }
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message);

        return error.message;
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  }
  return (
    <div>
      <Button
        sx={{
          borderRadius: 5,
          margin: 1,
        }}
        startIcon={<AddCircleIcon />}
        onClick={handleOpen}
      >
        Skelbti
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Dalintis
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              fullWidth
              id="outlined-multiline-static"
              label="Kometaras"
              multiline
              rows={4}
              onChange={handleCommentChange}
              sx={{
                marginTop: 2,
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Rating
                sx={{
                  marginLeft: 1,
                }}
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
              <Button onClick={HandleSubmit}>Dalintis</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
