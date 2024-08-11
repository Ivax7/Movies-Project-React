import React, { useState, useEffect } from 'react';
import StarRating from '../../../RecentFilms/Components/StarRating/StarRating';

const API_KEY = '5283c19927f618989362806677daa2df';
const BASE_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

function CarrouselFilms() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(BASE_URL)
      .then(response => response.json())
      .then(data => {
        const movies = data.results;
        if (movies.length > 0) {
          // Mezcla las películas aleatoriamente
          for (let i = movies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [movies[i], movies[j]] = [movies[j], movies[i]];
          }

          // Selecciona las primeras tres películas aleatorias
          const selectedMovies = movies.slice(0, 3);
          setMovies(selectedMovies);
        }
      })
      .catch(error => {
        console.error('Error fetching the movies:', error);
      });
  }, []);

  if (movies.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div id="carrousel" className='caroussel'>
      <h2 className='classical-title'>Classical Films</h2>
      <div className="carrousel-films">
        {movies.map((movie, index) => (
          <div key={index} className={index === 0 ? "left" : index === 1 ? "center" : "right"}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`Poster of ${movie.title}`}
          />
            <StarRating rating={movie.vote_average / 2} className="classical-rating" />
            </div>
        ))}
      </div>
    </div>
  );
}

export default CarrouselFilms;
