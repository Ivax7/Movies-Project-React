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
      console.log(`Cargando películas de la página ${page}...`);
      const response = await fetch(`${CONSTANTS.BASE_URL}&page=${page}`);
      const data = await response.json();

      if (data.results) {
        console.log('Se encontraron resultados en la respuesta de la API');
        console.log('Resultados:', data.results);

        // Mapear resultados a propiedades transformadas
        const transformedFilms = data.results.map(transformFilm); // Transformar cada película
        const totalPages = data.total_pages || 0; // Obtener el total de páginas

        return {
          films: transformedFilms,
          totalPages
        };
      } else {
        console.error('No se encontraron resultados en la respuesta de la API');
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
      const releaseDate = new Date(film.releaseDate); // Usar el nombre transformado
      return releaseDate <= today;
    });
  };

  useEffect(() => {
    const loadInitialFilms = async () => {
      console.log('Cargando películas iniciales...');
      const { films: initialFilms, totalPages: initialTotalPages } = await fetchFilms(1);
      const filteredInitialFilms = filterFilmsByReleaseDate(initialFilms);
      setFilms(filteredInitialFilms.slice(0, CONSTANTS.FILMS_PER_PAGE));
      setTotalPages(initialTotalPages);
      setCurrentPage(2); // Empezamos en la página 2 para la carga adicional
    };

    loadInitialFilms();
  }, []);

  const fetchMoreFilms = async () => {
    if (!loading && currentPage <= totalPages) {
      const { films: additionalFilms } = await fetchFilms(currentPage);
      const filteredAdditionalFilms = filterFilmsByReleaseDate(additionalFilms);
      
      setFilms(prevFilms => [...prevFilms, ...filteredAdditionalFilms.slice(0, CONSTANTS.FILMS_PER_LOAD_MORE)]);
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return { films, loading, fetchMoreFilms, totalPages, currentPage, hasError };
}
