import { useFilms } from '../hooks/useFilms';
import StarRating from '../StarRating/StarRating';

function Film() {
  const { films, loading, fetchMoreFilms, totalPages, currentPage, hasError } = useFilms();

  const handleLoadMore = (direction) => {
    fetchMoreFilms(direction);
  };

  return (
    <main className='movies'>
      <i className="fa-solid fa-arrow-right arrow left-arrow" onClick={() => handleLoadMore('prev')} disabled={loading || currentPage <= 2}></i>
      {films.map(film => (
        <div key={film.id} className={`film-container`}>
          <img
            className="film-image"
            src={film.posterPath
              ? `https://image.tmdb.org/t/p/w500${film.posterPath}`
              : 'https://images.emojiterra.com/twitter/512px/1f4fd.png'}
            alt={film.title}
          />
          <h2 className="film-title">
            {film.title}<br />
            <span className='film-release'>{film.releaseDate}</span>
            <StarRating rating={film.voteAverage / 2} /> {/* Aquí pasamos film.voteAverage */}
          </h2>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!loading && !hasError && currentPage <= totalPages && (
      <i className="fa-solid fa-arrow-right arrow right-arrow" onClick={() => handleLoadMore('next')} disabled={loading || currentPage > totalPages}></i>

      )}
      {!loading && !hasError && currentPage > totalPages && (
        <p>No hay más películas para cargar</p>
      )}
      {hasError && <p>Ocurrió un error al cargar las películas.</p>}
    </main>
  );
}

export default Film;
