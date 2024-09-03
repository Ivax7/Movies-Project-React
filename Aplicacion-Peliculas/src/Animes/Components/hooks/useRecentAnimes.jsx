import { useState, useEffect } from "react";
import { filterByDate } from "./FilterByDate";

export function useRecentAnimes() {
  const [animes, setAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchAnimes = async (url) => {
    let pageUrl = url;
    let allFilteredAnimes = [];

    while (allFilteredAnimes.length < 10) {
      try {
        const response = await fetch(pageUrl);
        const data = await response.json();

        // Filtrar animes cuya fecha de inicio no sea posterior a la fecha actual
        const filteredAnimes = filterByDate(data.data).filter(anime => {
          const status = anime.attributes.status;
          return (
            (status === 'current' || status === 'upcoming') &&
            anime.attributes.coverImage && anime.attributes.titles.en
          );
        });

        allFilteredAnimes = allFilteredAnimes.concat(filteredAnimes);

        if (allFilteredAnimes.length >= 10) {
          break;
        }

        pageUrl = data.links.next;
        if (!pageUrl) break;
      } catch (error) {
        console.error('Error fetching animes page:', error);
        break;
      }
    }

    const top10Animes = allFilteredAnimes.slice(0, 10);
    localStorage.setItem('top10Animes', JSON.stringify(top10Animes));
    setAnimes(top10Animes);
  };

  useEffect(() => {
    const storedAnimes = localStorage.getItem('top10Animes');
    if (storedAnimes) {
      setAnimes(JSON.parse(storedAnimes));
    } else {
      fetchAnimes("https://kitsu.io/api/edge/anime?sort=-startDate&limit=10");
    }
  }, []);

  const goToPreviousAnime = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? animes.length - 1 : prevIndex - 1));
    }
  };

  const goToNextAnime = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex === animes.length - 1 ? 0 : prevIndex + 1));
    }
  };

  const goToAnime = (index) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Duración de la transición

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Retornamos el JSX directamente
  return (
    animes.length > 0 ? (
      <article className="new-animes">
        <div id="left-arrow" className="left-arrow anime-arrow" onClick={goToPreviousAnime}>
          <i className="fa-solid fa-arrow-left"></i>
        </div>

        <div className="anime-information-container">
        {animes.map((anime, index) => (
          <div
            key={index}
            className={`anime-information ${index === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${anime.attributes.coverImage.large || anime.attributes.posterImage.small})`
            }}
          >
            <div className="information-title">
              <h4>{anime.attributes.titles.en || anime.attributes.titles.ja_jp}</h4>
              <h5>{anime.attributes.startDate}</h5>
            </div>
          </div>
        ))}
        <div className="pagination-dots">
          {animes.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToAnime(index)}
            ></span>
          ))}
        </div>
      </div>

        <div id="right-arrow" className="right-arrow anime-arrow" onClick={goToNextAnime}>
          <i className="fa-solid fa-arrow-right"></i>
        </div>

      </article>
    ) : (
      <p>Cargando animes recientes...</p>
    )
  );
}
