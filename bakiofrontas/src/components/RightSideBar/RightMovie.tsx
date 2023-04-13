import React from 'react'
import Box from '@mui/material/Box';
import './Movie.css'



interface IPost {
    id: any;
    title: any;
    createdDate: any;
    posterPath: any;
    
  }
const RightMovie: React.FC<IPost> = ({
    id,
    title,
    createdDate,
    posterPath,
  
  }) => {

    const Url = "https://image.tmdb.org/t/p/original"

  return (
    <div className='movie'>
        
        <Box
              component="img"
              sx={{
                margin: 1,
                borderRadius: 2,
                height: 1,
                width: '85%',


              }}
              alt="Movie"
              src={`${Url}${posterPath}`}
            />
            <p>{title}</p>
    </div>
  )
}

export default RightMovie