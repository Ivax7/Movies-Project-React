import { useState, useEffect } from "react";
import { getFormattedDates } from "./getFormattedDates";
import { handleLinkClick as externalHandleLinkClick} from "./handleLinkClick";

export function useRecentAnimes() {
  const [animes, setAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);

  const { firstDayFormatted, currentDateFormatted } = getFormattedDates();

  useEffect(() => {
    const fetchAnimes = async () => {
      const baseUrl = `https://api.jikan.moe/v4/anime?start_date=${firstDayFormatted}&end_date=${currentDateFormatted}&order_by=start_date&sort=desc`;
      const limit = 10;
      let fetchedAnimes = [];
      let page = 1;

      try {
        while (fetchedAnimes.length < limit) {
          const response = await fetch(`${baseUrl}&page=${page}&limit=${limit}`);
          
          if (!response.ok) throw new Error("Network error");

          const data = await response.json();
          if (!data.data.length) break;

          // Filtrar animes con título en inglés válido y excluir el género "Hentai"
          const filteredAnimes = data.data.filter(anime => {
            const isNotHentai = !anime.genres.some(genre => genre.name === "Hentai");
            return (
              anime.title_english && 
              anime.title_english.trim() !== '' && 
              new Date(anime.aired?.from).getFullYear() === 2024 && 
              isNotHentai
            );
          });

          fetchedAnimes = [...fetchedAnimes, ...filteredAnimes];
          if (data.data.length < limit) break;
          page++;
        }

        setAnimes(fetchedAnimes.slice(0, limit));
        localStorage.setItem('recentAnimes', JSON.stringify(fetchedAnimes.slice(0, limit)));
      } catch (error) {
        setError("Error fetching data");
      }
    };

    const storedAnimes = localStorage.getItem('recentAnimes');
    storedAnimes ? setAnimes(JSON.parse(storedAnimes)) : fetchAnimes();
  }, []);

  const goToPreviousAnime = () => {
    if (!isAnimating && animes.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? animes.length - 1 : prevIndex - 1));
      setTimeout(() => setIsAnimating(false), 500); // Desactivar la animación después de 500ms
    }
  };

  const goToNextAnime = () => {
    if (!isAnimating && animes.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex === animes.length - 1 ? 0 : prevIndex + 1));
      setTimeout(() => setIsAnimating(false), 500); // Desactivar la animación después de 500ms
    }
  };

  const handleLinkClick = () => {
    const currentAnime = animes[currentIndex];
    externalHandleLinkClick(currentAnime); // Llama a la función importada
  };

  return (
    <>
      {error && <p>{error}</p>}
      {animes.length > 0 ? (
        <article className="new-animes">

          <div id="left-arrow" className="left-arrow anime-arrow" onClick={goToPreviousAnime}>
          <i className="fa-solid fa-arrow-left"></i>
          </div>

          <div className="anime-information-container">
            {animes.map((anime, index) => (
              <div
                key={anime.mal_id}
                className={`anime-information ${index === currentIndex ? 'active' : ''}`}
              >
                {/* Añadimos la imagen como un componente HTML <img> */}
                  <img 
                  src={anime.images?.jpg?.large_image_url || ''} 
                  alt={anime.title_english || anime.title_japanese || 'No Title'} 
                  className="anime-image"
                  />
                  <div className="anime-title-information">
                    <h4>{anime.title_english || anime.title_japanese || 'No Title'}</h4>
                    
                    <div className="date-button">
                      <h5>{new Date(anime.aired?.from).toLocaleDateString()}</h5>
                      <button onClick={handleLinkClick}>More Info</button>
                    </div>

                    <p>{anime.synopsis}</p>
                  </div>
                </div>

            ))}
            <div className="pagination-dots">
              {animes.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                ></span>
              ))}
            </div>
          </div>

          <div id="right-arrow" className="right-arrow anime-arrow" onClick={goToNextAnime}>
          <i className="fa-solid fa-arrow-right"></i>
          </div>
        </article>
      ) : (
        !error && <p>Loading animes...</p>
      )}
    </>
  );
}
