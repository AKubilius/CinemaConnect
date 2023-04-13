import React, { useEffect, useState } from 'react'
import './Collection.css'
import { Box } from '@mui/material'
import axios from 'axios'
import Movie from './Movie'
import { useParams } from 'react-router-dom'
export default function Collection() {



  const [page, setPage] = useState<number>(1);
const [loading, setLoading] = useState<boolean>(false);

  const API = 'https://api.themoviedb.org/3/'
  const type = 'discover/movie'
  const [movies, setMovies] = useState<any[]>([])
  const { id } = useParams()

  const fetch = async (page: number) => {
    setLoading(true);
    const { data: { results } } = await axios.get(`${API}${type}`, {
      params: {
        api_key: 'c9154564bc2ba422e5e0dede6af7f89b',
        page: page,
        language: 'lt-LT',
        with_genres: id
      }
    });
    setMovies((prevMovies) => [...prevMovies, ...results]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    fetch(page);
  }, []);


  const handleOnScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  
    if (scrollTop + windowHeight >= documentHeight - 100 && !loading) {
      fetch(page);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleOnScroll);
    return () => {
      window.removeEventListener('scroll', handleOnScroll);
    };
  }, [page, loading]);

  return (
    
    <div className='collection'>

      {movies?.map((movie: any, index: React.Key | null | undefined) => (
                <Movie
                    id={movie.id}
                    poster_path={movie.poster_path}
                    backdrop_path={movie.backdrop_path}
                    title={movie.title}
                    createdDate ={movie.release_date}
                    key={index}
                />
            ))}
    </div>
  )
}
