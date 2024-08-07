// Api_variables/Api_variables.jsx
export const API_MAPPING = {
  "adult": "isAdult",
  "backdrop_path": "backdropPath",
  "genre_ids": "genreIds",
  "id": "id",
  "original_language": "originalLanguage",
  "original_title": "originalTitle",
  "overview": "overview",
  "popularity": "popularity",
  "poster_path": "posterPath",
  "release_date": "releaseDate",
  "title": "title",
  "video": "hasVideo",
  "vote_average": "voteAverage",
  "vote_count": "voteCount"
};

// Función para transformar los datos
export function transformFilm(film) {
  const transformedFilm = {};
  for (const key in film) {
    if (API_MAPPING[key]) {
      transformedFilm[API_MAPPING[key]] = film[key];
    } else {
      transformedFilm[key] = film[key]; // Mantener la propiedad original si no está en el mapeo
    }
  }
  return transformedFilm;
}
