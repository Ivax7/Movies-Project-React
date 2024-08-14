
export const API_KEY = '5283c19927f618989362806677daa2df';
export const MIN_VOTE_COUNT = 100; // Mínimo de votos deseado

export const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&vote_count.gte=${MIN_VOTE_COUNT}&primary_release_date.lte=${new Date().toISOString().split('T')[0]}`;

const CONSTANTS = {
  BASE_URL,
  FILMS_PER_PAGE: 5, // Número de películas por página
  FILMS_PER_LOAD_MORE: 5 // Número de películas que cargan
};

export default CONSTANTS;
