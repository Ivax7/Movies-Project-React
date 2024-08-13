import React, { useState, useEffect } from 'react';
import StarRating from '../../../RecentFilms/Components/StarRating/StarRating';

const API_KEY = '5283c19927f618989362806677daa2df';
const BASE_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

function CarrouselFilms() {
  const [movies, setMovies] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(prevPosition => (prevPosition + 1) % 3);
    }, 5000); // Cambia la posición cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
  }, []);

  if (movies.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div id="carrousel" className='caroussel'>
      <h2 className='classical-title'>Top Rated</h2>
      <button>See All</button>
      <div className="carrousel-films">
        {movies.map((movie, index) => {
          let positionClass = '';
          if (index === currentPosition) {
            positionClass = 'center';
          } else if ((index + 1) % 3 === currentPosition) {
            positionClass = 'right';
          } else {
            positionClass = 'left';
          }

          return (
            <div key={index} className={`film ${positionClass}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`Poster of ${movie.title}`}
              />
              <StarRating rating={movie.vote_average / 2} className="classical-rating" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CarrouselFilms;
