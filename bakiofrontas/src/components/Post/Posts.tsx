import React from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import Post from './Post';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Post {
    id: any;
    body: any;
    createdDate: any;
    imageUrl: any;
    movieId: any;
    
  }
  const url = 'https://localhost:7019'


const Posts : React.FC = () => {
  const requestInProgress = useRef(false);
  const token = `Bearer ${sessionStorage.getItem("token")}`
    const [posts, setPosts] = useState<any>([]);

    const [pages, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const [totalPosts, setTotalPosts] = useState<number>(0);

    const fetchPosts = useCallback(() => {
      if (requestInProgress.current) {
        return;
      }
    
      setLoading(true);
      requestInProgress.current = true;
    
      axios
        .get(`https://localhost:7019/Post`, {
          params: {
            pageSize:2,
            page: pages
          }
        })
        .then((response: { data: any[]; }) => {
          const newPosts = response.data.filter((post: any) => !posts.some((p: any) => p.id === post.id));
          setPosts((prevPosts: any) => [...prevPosts, ...newPosts]);
          setPage((prevPage) => prevPage + 1);
          setLoading(false);
          requestInProgress.current = false;
        })
        .catch((error: any) => {
          console.log(error);
          requestInProgress.current = false;
        });
    }, [pages, posts]);
      
      const handleOnScroll = useCallback(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
        if (!loading && scrollTop + windowHeight >= documentHeight - 100 && posts.length < totalPosts) {
          fetchPosts();
        }
      }, [loading, totalPosts]);
      
      useEffect(() => {
        fetchPosts();
        axios
          .get('https://localhost:7019/Post')
          .then((response: { data: string | any[]; }) => {
            setTotalPosts(response.data.length);
          })
          .catch((error: any) => console.log(error));
      }, [fetchPosts]);
      
      useEffect(() => {
        window.addEventListener('scroll', handleOnScroll);
        return () => {
          window.removeEventListener('scroll', handleOnScroll);
        };
      }, [totalPosts, handleOnScroll]);
    return (
        <div>
          
            {posts?.map((post: any, index: React.Key | null | undefined) => (
                <Post
                    id={post.id}
                    body={post.body}
                    imageUrl={post.imageUrl}
                    movieId={post.movieId}
                    createdDate ={post.createdDate}
                    key={index}
                />
            ))}
           
        </div>
    )
}

export default Posts