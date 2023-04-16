import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import { blueGrey, red} from '@mui/material/colors';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './Post.css'
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import TextField from '@mui/material/TextField/TextField';
import Comments  from './Comment';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import {makePostRequest, makeDeleteRequest} from "../Api/Api";

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

  const [pressed, setPressed] = useState(true);
  const [pressedLike, setPressedLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments,setComments] = useState<any>([]);

  const token = `Bearer ${sessionStorage.getItem("token")}`

  const handleLike = (Id: any) => {
    setPressedLike(!pressedLike);
    pressedLike ? unLikePost(Id) : likePost(Id)
    pressedLike ? setLikes(likes - 1) : setLikes(likes + 1)
  };

  const handleClick = (Id: any) => {
    setPressed(!pressed);
    pressed ? createRequest(Id) : deleteUser(Id)
  };

  const [value, setValue] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = ( ) => {
    // Handle form submission
    
    commentPost(value)
    setValue('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  async function commentPost(body: string) {
    const { data, status } = await makePostRequest('https://localhost:7019/api/Comment', { Body: body, postId: id });
    
    //setCreatedId(JSON.stringify(data, null, 4));

    return data;
  }

  const fetchComments = async () => {

    const { data } = await axios.get(`https://localhost:7019/api/Comment/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token
        },
      })
    setComments(data)


  }
  useEffect(() => {
    fetchComments()
  }, [])


  const fetchLikes = async () => {

    const { data } = await axios.get(`https://localhost:7019/like/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token
        },
      })
    setLikes(data)


  }
  useEffect(() => {
    fetchLikes()
  }, [])

  const fetchIsLiked = async () => {
    const { data } = await axios.get(`https://localhost:7019/like/isliked/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token
        },
      })

    setPressedLike(data)
  }
  useEffect(() => {
    fetchIsLiked()
  }, [])

  async function likePost(Id: any) {
    const { data } = await makePostRequest('https://localhost:7019/Like', { PostId: Id.id });

    return data;
  }
  
  async function unLikePost(Id: any) {
    const { data } = await makeDeleteRequest(`https://localhost:7019/Like/${Id.id}`);

    return data;
  }

  async function createRequest(Id: any) {
    const { data } = await makePostRequest('https://localhost:7019/List', { MovieID: `${Id.movieId}` });
    
    return data;
  }

  async function deleteUser(Id: any) {
    const { data } = await makeDeleteRequest(`https://localhost:7019/List/${Id.movieId}`);

    return data;
  }

  const buttonSx = 
  {
    borderRadius: 5,
    margin: 1
  }

  const neutralButtonSx = {
    ...buttonSx,
    color: blueGrey[900]
  };

  const deleteButtonSx = {
    ...buttonSx,
    color: red[900]
  };

  return (
    <div className='post'>
      <Box sx={{ borderRadius: 5, boxShadow: '0 4px 6px grey' }}>
        <Box sx={{ display: 'flex' }}>
          <Avatar sx={{ bgcolor: blueGrey[900], margin: 2 }} variant="rounded" />
          <p>{body}</p>
        </Box>
        
        <Box
          component="img"
          alt="Movie"
          sx={{ marginLeft: 1, marginRight: 1, borderRadius: 5, width: '97%', }}
          src={`https://image.tmdb.org/t/p/original${imageUrl}`}
        />
        <Box>

          <Box sx={{ marginLeft: 1, marginRight: 1, borderTop:1, borderBottom:1, borderColor: 'grey', display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
            <p> {likes} </p>

            <Button onClick={() => handleLike({ id })} sx={neutralButtonSx} startIcon={pressedLike ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />} variant="text">Patinka</Button>
            <Button sx={neutralButtonSx} startIcon={<ReplyIcon />} variant="text">Pasidalinti</Button>

            <Button 
              onClick={() => handleClick({ movieId })} 
              sx={pressed ? neutralButtonSx : deleteButtonSx} 
              startIcon={pressed ? <AddCircleIcon /> : <DeleteIcon/> } 
              variant="text"
            >
              {pressed ? "Pridėti" : "Pašalinti"}
            </Button>

          </Box>
          
          <Box component="form" noValidate autoComplete="off" sx={{ display:'flex', flexDirection:'row', alignContent:'center'}}>
            <div style={{display:'grid',alignContent:'center', margin:10}}>
              <Avatar 
                sx={{ bgcolor: blueGrey[900] }} 
                src={`data:image/jpeg;base64,${sessionStorage.getItem("image")}`}
              />
            </div>

            <TextField 
              fullWidth 
              id="outlined-multiline-static" 
              label="Komentaras" 
              sx={{marginRight:1, marginBottom:2, marginTop:2, overflow:'hidden'}}
              inputProps={{ style: { overflow: 'hidden' } }}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Box>
          
          <Box sx={{ display:'flex', flexDirection:'column' }}>
            { comments ? comments?.slice(0,3).map((user: any, index: React.Key | null | undefined) => (
                <Comments
                    body={user.body}
                    img={user.user.profileImageBase64}
                    id ={user.id}
                />
            )): null}
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default Post