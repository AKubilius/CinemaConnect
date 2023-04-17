import React from 'react'
import {useEffect, useState} from 'react'
import axios,{ AxiosRequestConfig } from 'axios'
import User from './User';

const Users = () => {
    const[users,setusers] = useState<any>([]);
    const token = `Bearer ${sessionStorage.getItem("token")}`
    const fetch = async () =>{
        
        const {data} = await axios.get(`https://localhost:7019/user`,
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: token
              },
        })
        setusers(data)
        console.log(data)

    }
    useEffect(()=>{
        fetch()
    }, [])


  return (
    <div>
      {users?.slice(0, 3).map((user: any, index: React.Key | null | undefined) => (
        <User
          username={user.userName}
          name={user.name}
          surname={user.surname}
          image64={user.profileImageBase64}
          id={user.id}
          key={user.id}
        />
      ))}
    </div>
  )
}

export default Users