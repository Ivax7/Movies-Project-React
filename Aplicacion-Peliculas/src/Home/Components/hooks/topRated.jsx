import { API_KEY } from '../../../Components/Consts/consts';
import { useState, useEffect } from 'react';

export function Modal({ closeModal }) {

  const [movies, setMovies] = useState([]);

  // Llamada a la API dentro de useEffect
  useEffect(() => {
    const BASE_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

    fetch(BASE_URL)
      .then(response => response.json())
      .then(data => {
        const topRatedMovies = data.results; // Películas mejor valoradas
        setMovies(topRatedMovies); // Guardar películas en el estado
      })
      .catch(error => {
        console.error('Error fetching the movies:', error);
      });
  }, []); // El array vacío asegura que la llamada solo se haga una vez cuando se monte el componente


  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="top-films-title">
          <h2>Top Rated Films</h2>
          <button className="close-modal" onClick={closeModal}>Close</button>
        </div>

        {/* Mostrar películas en el modal */}
        {movies.length > 0 ? (
          <ul>
            {movies.map(movie => (
              <li key={movie.id}>
                <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={`Poster of ${movie.title}`}
                  />
                
                <span>
                  <strong>{movie.title}</strong> - <em>
                  {movie.vote_average}/10</em>
                </span>

              </li>
            ))}
          </ul>
        ) : (
          <p>Loading movies...</p>
        )}

      </div>
    </div>
  );
}