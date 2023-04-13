import {useEffect, useState} from 'react'
import axios from 'axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import React from 'react';
import { useParams } from "react-router-dom";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}


export default function BasicTable() {

    const Image_Path = "https://image.tmdb.org/t/p/w500"
    const {type} = useParams();
    const API = 'https://api.themoviedb.org/3/'
    const[movies,setMovies] = useState<any[]>([])
    const[List,setList] = useState<any[]>([])
    
    const fetchIds = async  () => {
        try {
          const {data} = await axios.get(`https://localhost:7019/List`, {
              headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
          });
          console.log(data)
      
          data.map((data: { movieID: any; }) => fetchMovies(data?.movieID))
        } catch(e) {}
      }
      const fetchMovies = async  (id: any) => {
        try {
          const {data} = await axios.get(`${API}/movie/${id}`, {
            params:{
                api_key: 'c9154564bc2ba422e5e0dede6af7f89b',
            }
          })
          console.log(data)
      
          setMovies((prevState) => [...prevState, data])
        } catch(e) {}
        
      }
      useEffect(() => {
        fetchIds()
      }, [])


  

  return (
    <React.Fragment>
    <TableContainer component={Paper} sx={{left:230,position:'absolute',maxWidth:1200,alignContent:'fixed',marginTop:1}}>
      <Table sx={{ minWidth: 420}} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell align="right">Rank</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Your score</TableCell>
            <TableCell align="right">Your friends score</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movies.map((row,index) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell align="right">{index+1}</TableCell>
              <TableCell component="th" scope="row">
              <img width={150} height={200} src={`${Image_Path}${row.poster_path}`}/>{row.title}
              </TableCell>
              <TableCell align="right">{row.vote_average}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right"><Button variant="outlined"> Remove</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </React.Fragment>
  );
}