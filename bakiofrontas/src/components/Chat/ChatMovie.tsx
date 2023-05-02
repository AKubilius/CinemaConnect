import Box from '@mui/material/Box/Box'
import React from 'react'

export const ChatMovie = (movie:any) => {
  return (
    <div>
         <div>{movie.title} </div>
         <Box
                                  component="img"
                                  sx={{
                                    margin: 1,
                                    borderRadius: 2,
                                    height: 1,
                                    width: '40%',

                                  }}
                                  alt="Movie"
                                  src={`${movie.Url}`}
                                />
        {/* Render additional movie information, such as image and title, when available */}
    </div>
  )
}
