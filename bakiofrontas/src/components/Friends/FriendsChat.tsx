import React from 'react'
import {useEffect, useState} from 'react'
import axios,{ AxiosRequestConfig } from 'axios'
import Grid from '@mui/material/Grid/Grid';
import Friend from './FriendChat';
import Box from '@mui/material/Box/Box';

const FriendsChat = () => {
    const[friends,setFriends] = useState<any>([]);
    const token = `Bearer ${sessionStorage.getItem("token")}`
    const fetch = async () =>{
        
        const {data} = await axios.get(`https://localhost:7019/user/friends`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: token
              },
        })
        setFriends(data)
        console.log(data)

    }
    useEffect(()=>{
        fetch()
    }, [])

  return (
    <div>
{friends?.map((user: any, index: React.Key | null | undefined) => (
                <Friend
                    username={user.userName}
                    name={user.name}
                    surname={user.surname}
                    image64={user.profileImageBase64}
                    id ={user.id}
                />
            ))}
            </div>
    
  )
}

export default FriendsChat