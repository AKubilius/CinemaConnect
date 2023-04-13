import React from 'react'
import {useEffect, useState} from 'react'
import axios,{ AxiosRequestConfig } from 'axios'
import Grid from '@mui/material/Grid/Grid';
import User from './User';

const Users = () => {
    const[movies,setMovies] = useState<any>([]);
    const fetch = async () =>{
        
        const {data} = await axios.get(`https://localhost:7019/user`,
        {
            
        })
        setMovies(data)
        console.log(data)

    }
    useEffect(()=>{
        fetch()
    }, [])


  return (
    <div>

{movies?.slice(0,3).map((movie: any, index: React.Key | null | undefined) => (
                <User
                    username={movie.userName}
                    name={movie.name}
                    surname={movie.surname}
                    id ={movie.id}
                />
            ))}
    </div>
  )
}

export default Users