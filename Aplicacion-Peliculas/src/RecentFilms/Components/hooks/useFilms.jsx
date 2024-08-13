import { useState, useEffect } from 'react';
import CONSTANTS from '../../../Components/Consts/consts';
import { transformFilm } from '../../../Components/Api_Variables/Api_Variables'; // Importar mapeo y transformación

export function useFilms() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasError, setHasError] = useState(false);

  const fetchFilms = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`${CONSTANTS.BASE_URL}&page=${page}`);
      const data = await response.json();

      if (data.results) {
        const transformedFilms = data.results.map(transformFilm);
        const totalPages = data.total_pages || 0;

        return {
          films: transformedFilms,
          totalPages
        };
      } else {
        setHasError(true);
        return {
          films: [],
          totalPages: 0
        };
      }
    } catch (error) {
      console.error('Error fetching films:', error);
      setHasError(true);
      return {
        films: [],
        totalPages: 0
      };
    } finally {
      setLoading(false);
    }
  };

  const filterFilmsByReleaseDate = (filmsToFilter) => {
    const today = new Date();
    return filmsToFilter.filter(film => {
      const releaseDate = new Date(film.releaseDate);
      return releaseDate <= today;
    });
  };

  useEffect(() => {
    const loadInitialFilms = async () => {
      const { films: initialFilms, totalPages: initialTotalPages } = await fetchFilms(1);
      const filteredInitialFilms = filterFilmsByReleaseDate(initialFilms);
      setFilms(filteredInitialFilms.slice(0, CONSTANTS.FILMS_PER_PAGE));
      setTotalPages(initialTotalPages);
      setCurrentPage(2); // Empezamos en la página 2 para la carga adicional
    };

    loadInitialFilms();
  }, []);

  const fetchMoreFilms = async (direction = 'next') => {
    if (!loading) {
      const newPage = direction === 'next' ? currentPage : currentPage - 2;
      if (newPage > 0 && newPage <= totalPages) {
        const { films: newFilms } = await fetchFilms(newPage);
        const filteredNewFilms = filterFilmsByReleaseDate(newFilms);
        setFilms(filteredNewFilms.slice(0, CONSTANTS.FILMS_PER_PAGE));
        setCurrentPage(direction === 'next' ? currentPage + 1 : currentPage - 1);
      }
    }
  };

  return { films, loading, fetchMoreFilms, totalPages, currentPage, hasError };
}
