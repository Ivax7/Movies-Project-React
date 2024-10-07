import { useState, useEffect } from 'react';
import StarRating from '../../../RecentFilms/Components/StarRating/StarRating';
import { API_KEY } from '../../../Components/Consts/consts';

const MIN_VOTE_AVERAGE = 6.5;
const MIN_VOTE_COUNT = 100;
const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&vote_count.gte=${MIN_VOTE_COUNT}&vote_average.gte=${MIN_VOTE_AVERAGE}&primary_release_date.lte=${new Date().toISOString().split('T')[0]}`;

function RandomHighRatedMovie() {
  const [movie, setMovie] = useState(null);

  function GenerateRandomFilm() {
    fetch(BASE_URL)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      if (movies.length > 0) {
        // Selecciona una película al azar
        const randomIndex = Math.floor(Math.random() * movies.length);
        setMovie(movies[randomIndex]);
      }
    })
    .catch(error => {
      console.error('Error fetching the movies:', error);
    });
  }

  useEffect(() => {
    GenerateRandomFilm()
  }, []);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {movie ? (
        <>
          <div id="review">
            <div id="review-text">
              <h2>{movie.title} ({new Date(movie.release_date).getFullYear()})</h2>
              <p>{movie.overview}</p>
              <StarRating rating={movie.vote_average / 2} /> {/* Divide por 2 si la valoración es sobre 10 */}
            </div>
            <button className="selector random-film" onClick={GenerateRandomFilm}><i className="fa-solid fa-shuffle"></i><span>RANDOM FILM</span></button>
            <div id="poster">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`Poster of ${movie.title}`} />
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default RandomHighRatedMovie;
