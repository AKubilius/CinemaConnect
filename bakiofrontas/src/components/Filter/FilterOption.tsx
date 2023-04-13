import Box from '@mui/material/Box/Box'
import React from 'react'
import './Filter.css'
export default function FilterOption(option:any) {
  return (
    <div className='filterOption'>
       <Box
      sx={{
        width:'100%',
        marginTop:1,
        '&:hover': {
          
          opacity: [0.9, 0.8, 0.7],
        },
      }}
    ><a href={`/movies/${option.id}`}>{option.name}</a></Box>

        
    </div>
  )
}
