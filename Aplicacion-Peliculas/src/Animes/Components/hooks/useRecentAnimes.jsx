import { useState, useEffect } from "react";

export function useRecentAnimes() {
  const [animes, setAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      const baseUrl = `https://api.jikan.moe/v4/anime`;
      let fetchedAnimes = [];
      let page = 1;
      const limit = 10;
      const requiredCount = 10;

      try {
        while (fetchedAnimes.length < requiredCount) {
          const response = await fetch(`${baseUrl}?page=${page}&limit=${limit}&order_by=start_date&sort=desc`);
          
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json();

          if (data.data && data.data.length > 0) {
            console.log('Fetched Animes from page', page, ':', data.data);

            // Filtrar animes que tengan al menos un título en inglés válido
            const filteredAnimes = data.data.filter(anime =>
              anime.titles &&
              anime.titles.length > 0 &&
              (anime.title_english && anime.title_english.trim() !== '' && anime.title_english !== 'null')
            );

            fetchedAnimes = [...fetchedAnimes, ...filteredAnimes];

            if (data.data.length < limit) {
              break; // No más datos disponibles, salir del bucle
            }
            
            page++; // Ir a la siguiente página
          } else {
            setError("No animes found.");
            break;
          }
        }

        // Solo guardar los primeros 10 animes válidos
        const uniqueAnimes = Array.from(new Set(fetchedAnimes.map(anime => anime.mal_id)))
          .map(id => {
            return fetchedAnimes.find(anime => anime.mal_id === id);
          });

        const validAnimes = uniqueAnimes.slice(0, requiredCount);
        
        if (validAnimes.length > 0) {
          setAnimes(validAnimes);
          localStorage.setItem('recentAnimes', JSON.stringify(validAnimes));
        } else {
          setError("No animes with valid titles found.");
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
      }
    };

    const storedAnimes = localStorage.getItem('recentAnimes');
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


  const handleLinkClick = () => {
    if (animes.length > 0) {
      const currentAnime = animes[currentIndex];
      console.log("Clicked anime:", currentAnime);
      const url = `https://myanimelist.net/anime/${currentAnime.mal_id}`;
      window.open(url, '__blank');
    }
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
            style={{
              backgroundImage: `url(${anime.images?.jpg?.large_image_url || ''})`
            }}
          >
            <div className="information-title">
              <h4>
                {anime.titles.find(title => title.type === 'English')?.title ||
                anime.titles.find(title => title.type === 'Japanese')?.title ||
                'No Title'}
              </h4>
              <h5>{anime.aired?.from ? new Date(anime.aired.from).toLocaleDateString() : 'Unknown'}</h5>
            {/* Nuevo botón dentro del div */}
              <button 
                onClick={() => handleLinkClick(anime)}
              >
                Info
              </button>
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
