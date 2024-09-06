import { useState, useEffect } from "react";
import { IconThumbUp, IconBookmark } from '@tabler/icons-react';

const TOP_ANIME_URL = "https://api.jikan.moe/v4/top/anime";

// Función sleep para pausar la ejecución
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function useMostPopular() {
  const [popularAnimes, setPopularAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopularity = async () => {
    setLoading(true);
    setError(null);

    try {
      let allAnimes = [];
      let page = 1;
      const limit = 50;
      const perPage = 10;

      while (allAnimes.length < limit) {
        try {
          const response = await fetch(`${TOP_ANIME_URL}?page=${page}&limit=${perPage}`);
          if (!response.ok) {
            if (response.status === 429) { // Si recibimos un error 429, hacemos una pausa
              console.warn('Rate limit exceeded, pausing...');
              await sleep(10000); // Pausa de 10 segundos
              continue; // Reintenta la solicitud
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          allAnimes = [...allAnimes, ...data.data];
          page++;
          if (allAnimes.length >= limit) break;
        } catch (error) {
          console.error('Error fetching animes page:', error);
          setError(error.message);
          break;
        }
      }

      // Ordena los animes por número de miembros en orden descendente
      const sortedAnimes = allAnimes.sort((a, b) => b.members - a.members);

      // Selecciona los 10 animes con más miembros
      const top10ByMembers = sortedAnimes.slice(0, 10);

      // Guardar los datos en localStorage
      localStorage.setItem('popularAnimes', JSON.stringify(top10ByMembers));

      // Actualizar el estado con los datos obtenidos
      setPopularAnimes(top10ByMembers);

    } catch (error) {
      console.error('Error fetching animes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Intentar cargar los datos desde localStorage
    const savedPopularAnimes = localStorage.getItem('popularAnimes');

    if (savedPopularAnimes) {
      setPopularAnimes(JSON.parse(savedPopularAnimes));
      setLoading(false);
    } else {
      fetchPopularity();
    }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="right-section">
      <article className='popular-animes'>
        <h4>Most Popular</h4>
        {popularAnimes.map((anime, index) => (
          <div
            key={anime.mal_id}
            className="popular-information"
            style={{ backgroundImage: `url(${anime.images.jpg.large_image_url || 'default_image_url'})` }}
          >
            <div className="rank">{index + 1}</div>
            <div className="title">{anime.title}</div>
            <div className="popularity">Likes: {anime.members}</div>
            
            <div className="action-buttons">
              <button className="save-button"><IconBookmark stroke={2} /></button>
              <button className="like-button"><IconThumbUp stroke={2} /></button>
            </div>
          </div>
        ))}
      </article>
    </div>
  );
}
