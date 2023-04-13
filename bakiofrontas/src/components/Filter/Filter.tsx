import Box from '@mui/material/Box/Box'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import FilterOption from './FilterOption'


type User = {
    id: number;
    name: string;
  };

export default function Filter() {


    const API = 'https://api.themoviedb.org/3/'
    const type = 'genre/movie/list'
    const [genres, setGenres] = useState<any>([])
  
    const fetch = async () => {

        const { data} = await axios.get<any>(`${API}${type}`,
          {
            params: {
              api_key: 'c9154564bc2ba422e5e0dede6af7f89b',
              language:'lt-LT',
            }
          })
        setGenres(data)
        console.log(data)
        
      }
      useEffect(() => {
        fetch()
      }, [])


  return (
    <div>

<Box >
        <Box sx={{ bgcolor: '#cfe8fc', display: 'flex', borderRadius: 2, marginBottom: 15, boxShadow: '0 4px 6px grey',flexDirection:'column' }}>
           <p>Kategorijos</p>
           {genres.genres?.map((user: any) => (
                <FilterOption
                    name={user.name}
                    id ={user.id}
                />
            ))}
          
        </Box>
        
    </Box>
    </div>
  )
}
