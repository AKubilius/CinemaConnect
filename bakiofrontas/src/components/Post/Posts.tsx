import React, { useEffect, useState } from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import Post from './Post';


interface Post {
    id: any;
    body: any;
    createdDate: any;
    imageUrl: any;
    movieId: any;
    
  }
  const url = 'https://localhost:7019'


const Posts : React.FC = () => {
    const [posts, setPosts] = useState<any>([]);

    const [pages, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const [totalPosts, setTotalPosts] = useState<number>(0);

    const fetchPosts = () => {
        setLoading(true);
        axios
          .get(`https://localhost:7019/Post?page=${pages}&pageSize=2`)
          .then((response: { data: any[]; }) => {
            const newPosts = response.data.filter((post: any) => !posts.some((p: any) => p.id === post.id));
            setPosts((prevPosts: any) => [...prevPosts, ...newPosts]);
            setPage((prevPage) => prevPage + 1);
            setLoading(false);
          })
          .catch((error: any) => console.log(error));
      };
      
      const handleOnScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
        if (scrollTop + windowHeight >= documentHeight - 100 && !loading && posts.length < totalPosts) {
          fetchPosts();
        }
      };
      
      useEffect(() => {
        fetchPosts();
        axios
          .get('https://localhost:7019/Post')
          .then((response: { data: string | any[]; }) => {
            
            setTotalPosts(response.data.length);
          })
          .catch((error: any) => console.log(error));
      }, []);
      
      useEffect(() => {
        window.addEventListener('scroll', handleOnScroll);
        return () => {
          window.removeEventListener('scroll', handleOnScroll);
        };
      }, [posts, loading, totalPosts]);
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