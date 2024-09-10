import { useState, useEffect } from "react";

export function useTopRankedAnimes() {
  const [animes, setAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      const baseUrl = `https://api.jikan.moe/v4/anime`;
      
      try {
        const response = await fetch(`${baseUrl}?page=1&limit=10`);
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        console.log("Fetched data:", data);

        if (data.data && data.data.length > 0) {
          setAnimes(data.data);
          localStorage.setItem('topRankedAnimes', JSON.stringify(data.data));
        } else {
          setError("No animes found.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
      }
    };

    const storedAnimes = localStorage.getItem('topRankedAnimes');
    if (storedAnimes) {
      setAnimes(JSON.parse(storedAnimes));
    } else {
      fetchAnimes();
    }
  }, []);

  useEffect(() => {
    console.log("Current index:", currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    console.log("Animes array:", animes);
  }, [animes]);

  const goToPreviousAnime = () => {
    if (!isAnimating && animes.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex === 0 ? animes.length - 1 : prevIndex - 1;
        console.log("Going to previous anime, index:", newIndex);
        return newIndex;
      });
    }
  };

  const goToNextAnime = () => {
    if (!isAnimating && animes.length > 0) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex === animes.length - 1 ? 0 : prevIndex + 1;
        console.log("Going to next anime, index:", newIndex);
        return newIndex;
      });
    }
  };

  const goToAnime = (index) => {
    if (!isAnimating && animes.length > 0) {
      setIsAnimating(true);
      console.log("Going to specific anime, index:", index);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const handleLinkClick = (anime) => {
    console.log("Clicked anime:", anime);
    const url = `https://myanimelist.net/anime/${anime.mal_id}`;
    window.open(url, '__blank');
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
                key={anime.mal_id} // Usa `mal_id` como clave única
                className={`anime-information ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  console.log(`Clicked anime at index ${index}:`, anime); // Agrega esta línea para depuración
                  handleLinkClick(anime);
                }}
                style={{
                  backgroundImage: `url(${anime.images?.jpg?.large_image_url || ''})`
                }}
              >
                <div className="information-title">
                  <h4>{anime.titles?.find(title => title.type === 'English')?.title || 'No Title'}</h4>
                  <h5>{anime.aired?.from ? new Date(anime.aired.from).toLocaleDateString() : 'Unknown'}</h5>
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
        !error && <p>Cargando animes...</p>
      )}
    </>
  );
}
