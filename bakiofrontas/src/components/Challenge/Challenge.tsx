import { Box } from '@mui/material';
import React from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

interface Challenges
{
  name:string;
  count:number;
}
interface userChallenge {
  progress:number;
  completed:boolean;
  challenge:Challenges;
}

interface ChallengeComponentProps {
  userChallenge: userChallenge;
}

const style ={
  marginBottom:0
  
}
const Challenge: React.FC<ChallengeComponentProps> = ({ userChallenge }) => {
  
  return (
    <Box>
      <h5 style={style}> {userChallenge.challenge.name}</h5>
          <LinearProgress
            variant="determinate"
            value={userChallenge.progress /userChallenge.challenge.count * 100 }
            sx={{
              marginLeft:1,
              marginRight:1,
              flexGrow: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.12)',
            }}
          />
          <span style={{ marginLeft: '1rem' }}>{userChallenge.progress} / {userChallenge.challenge.count}</span>

    </Box>
  )
}

export default Challenge