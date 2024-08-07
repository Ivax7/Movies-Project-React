
const API_KEY = '5283c19927f618989362806677daa2df';
const MIN_VOTE_COUNT = 100; // Mínimo de votos deseado
const MIN_VOTE_AVERAGE = 3; // Mínimo de puntuación deseada

const BASE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&vote_count.gte=${MIN_VOTE_COUNT}&vote_average.gte=${MIN_VOTE_AVERAGE}&primary_release_date.lte=${new Date().toISOString().split('T')[0]}`;

const CONSTANTS = {
  BASE_URL,
  FILMS_PER_PAGE: 12, // Número de películas por página
  FILMS_PER_LOAD_MORE: 6 // Número de películas que cargan
};

export default CONSTANTS;
