import React from 'react';
import Img from './Img.jsx';
import Title from './Title.jsx';
import { useState, useEffect } from 'react';
// Implementar API y ordenar las 20 primeras películas por orden de release
const API_KEY = '6a9df592'
const URL = (`https://www.omdbapi.com/?s=avengers&apikey=${API_KEY}`)

function Film() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    getFilms();
  }, []); // llamamos a la función 1 vez cuando carga

  function getFilms()  {
    fetch(URL)
    .then(res => res.json())
    .then(data =>{
      if (data.Search) {
        const sortedFilms = data.Search
        .slice(0, 20) // obtenemos solo las 20 películas más recientes
        .sort((a, b) => new Date(b.Year) - new Date(a.Year));
        
        setFilms(sortedFilms)
      }
    })
  }

  return (
    <main className='movies'>
      {films.map((pelicula, index) => (
        <div key={index} className='film-container'>
          <Img
            src={pelicula.Poster}
            alt={pelicula.Title}
          />
          <Title title={pelicula.Title} />
        </div>
      ))}
    </main>
  );
}


export default Film;
