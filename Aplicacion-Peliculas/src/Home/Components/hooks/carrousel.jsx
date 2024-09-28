import React, { useState, useEffect } from 'react';
import StarRating from '../../../RecentFilms/Components/StarRating/StarRating';
import { API_KEY } from '../../../Components/Consts/consts';
import { Modal } from './topRated';
const BASE_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

function CarrouselFilms() {
  const [movies, setMovies] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [flippedCards, setFlippedCards] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    fetch(BASE_URL)
      .then(response => response.json())
      .then(data => {
        const movies = data.results;
        if (movies.length > 0) {
          for (let i = movies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [movies[i], movies[j]] = [movies[j], movies[i]];
          }

          // Obtener detalles adicionales para cada película (director y protagonistas)
          const moviePromises = movies.slice(0, 3).map(movie => {
            const creditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`;
            return fetch(creditsUrl)
              .then(response => response.json())
              .then(creditsData => {
                const director = creditsData.crew.find(member => member.job === 'Director');
                const protagonists = creditsData.cast.slice(0, 3).map(actor => actor.name);
                return {
                  ...movie,
                  director: director ? director.name : 'Unknown',
                  protagonists: protagonists.join(', ')
                };
              });
          });

          Promise.all(moviePromises).then(moviesWithDetails => {
            setMovies(moviesWithDetails);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching the movies:', error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(prevPosition => (prevPosition + 1) % 3);
    }, 5000); // Cambia la posición cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (index) => {
    setFlippedCards(prevFlippedCards =>
      prevFlippedCards.includes(index)
        ? prevFlippedCards.filter(i => i !== index)
        : [...prevFlippedCards, index]
    );
  };

  const handleSeeAllClick = () => {
    setShowModal(true); // Mostrar el modal al hacer clic en "See All"
  };

  const closeModal = () => {
    setShowModal(false); // Cerrar el modal
  };

  return (
    <div id="carrousel" className='caroussel'>
      <h2 className='classical-title'>Top Rated</h2>
      <button className='see-all-films' onClick={handleSeeAllClick}>See All</button>

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

          const isFlipped = flippedCards.includes(index);

          return (
            <div 
              key={index} 
              className={`film ${positionClass} ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="film-inner">
                <div className="film-front">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`Poster of ${movie.title}`}
                  />
                  <StarRating rating={movie.vote_average / 2} className="classical-rating" />
                </div>
                <div className="film-back">
                  <h2 className='back-title'>{movie.title}</h2>
                  <p><strong>Release Date:</strong> {new Date(movie.release_date).getFullYear()}</p>
                  <p><strong>Director:</strong> {movie.director}</p>
                  <p><strong>Protagonists:</strong> {movie.protagonists}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal closeModal={closeModal} />
      )}
    </div>
  );
}

export default CarrouselFilms;

