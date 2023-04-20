import React from 'react'
import { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import Grid from '@mui/material/Grid/Grid';
import Request from './Request';
import Box from '@mui/material/Box/Box';


export default function Requests() {

    const [users, setusers] = useState<any>([]);
    const token = `Bearer ${sessionStorage.getItem("token")}`
    const fetch = async () => {

        const { data } = await axios.get(`https://localhost:7019/FriendRequest`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: token
                }
            })
        setusers(data)
        console.log(data)

    }
    useEffect(() => {
        fetch()
    }, [])


    return (
        <div>

            {users ? <Box
                sx={{
                    bgcolor: 'lightgrey',
                    display: 'flex',
                    borderRadius: 1,
                    boxShadow: '0 4px 6px grey',
                    width: '25vh',
                    justifyContent: 'space-between',
                    alignContent: 'center'
                }}>
            </Box> : users?.slice(0, 3).map((user: any, index: React.Key | null | undefined) => (
                <Request
                    username={user.name}
                    id={user.id}
                />))}
        </div>
    )
}
