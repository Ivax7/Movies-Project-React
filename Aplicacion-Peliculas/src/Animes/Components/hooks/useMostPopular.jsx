import { useState, useEffect } from "react";
import { IconThumbUp, IconBookmark } from '@tabler/icons-react';

const TOP_ANIME_URL = "https://api.jikan.moe/v4/top/anime";

export function useMostPopular() {
  const [popularAnimes, setPopularAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPopularity = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(TOP_ANIME_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let allAnimes = data.data;

      const sortedAnimes = allAnimes.sort((a, b) => b.members - a.members);
      const top10ByMembers = sortedAnimes.slice(0, 10);
      localStorage.setItem('popularAnimes', JSON.stringify(top10ByMembers));

      setPopularAnimes(top10ByMembers);

    } catch (error) {
      console.error('Error fetching animes:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Función para manejar el click y redirigir a un enlace
  const handleLinkClick = (anime) => {
    // Reemplaza esta URL con la estructura de enlace que desees
    const url = `https://myanimelist.net/anime/${anime.mal_id}`;
    
    window.open(url, '__blank') // Redirige al usuario a la URL
  };


  return (
    <div className="right-section">
      <article className='popular-animes'>
        <h4>Most Popular</h4>
        <div className="information">
          {popularAnimes.map((anime, index) => (
            <div
              key={anime.mal_id}
              className="popular-information"
              style={{ backgroundImage: `url(${anime.images.jpg.large_image_url || 'default_image_url'})` }}
              onClick={() => handleLinkClick(anime)} // Agrega el evento onClick aquí
            >
              <div className="rank">{index + 1}</div>
              <div className="title">{anime.title}</div>
              <div className="popularity"><IconThumbUp stroke={2} /> {anime.members}</div>
              
              <div className="action-buttons">
                <button className="like-button"><IconThumbUp stroke={2} /></button>
                <button className="save-button"><IconBookmark stroke={2} /></button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}



