import { useState, useEffect } from 'react';
import Nav from '../../../Home/Components/hooks/Nav';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AnimeMain.css';

function AnimeMain() {
  const [animes, setAnimes] = useState([]);
  const [ovas, setOvas] = useState([]);  // Estado para los OVAs, películas y especiales
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  function goToHub() {
    navigate('/');
  }

  function goToAnimes() {
    navigate('/animes');
  }

  const fetchAnimes = (url) => {
    // Verificar si los animes ya están en caché
    const cachedAnimes = localStorage.getItem('cachedAnimes');
    if (cachedAnimes) {
      const cachedData = JSON.parse(cachedAnimes);
      // Solo toma los primeros 10 animes de la caché si existen
      setAnimes(cachedData.slice(0, 10));
    } else {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const filteredAnimes = data.data.filter(anime => {
            const status = anime.attributes.status;
            const startDate = new Date(anime.attributes.startDate);
            const currentDate = new Date();

            return (
              (status === 'current' || status === 'upcoming') &&
              startDate <= currentDate &&
              anime.attributes.coverImage && anime.attributes.titles.en
            );
          });

          // Solo guarda los primeros 10 animes en caché
          const top10Animes = filteredAnimes.slice(0, 10);
          localStorage.setItem('cachedAnimes', JSON.stringify(top10Animes)); // Guardar en caché
          setAnimes(top10Animes);
        })
        .catch(error => console.error('Error fetching animes:', error));
    }
  };

  const fetchOvas = (url, accumulatedOvas = []) => {
    // Verificar si los OVAs ya están en caché
    const cachedOvas = localStorage.getItem('cachedOvas');
    if (cachedOvas) {
      setOvas(JSON.parse(cachedOvas));
    } else {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const filteredOvas = data.data.filter(anime => {
            const subtype = anime.attributes.subtype;
            const startDate = new Date(anime.attributes.startDate);
            const currentDate = new Date();

            return (
              (subtype === 'ONA' || subtype === 'Movie' || subtype === 'Special') &&
              startDate <= currentDate &&
              anime.attributes.coverImage && anime.attributes.titles.en
            );
          });

          // Solo guarda los primeros 10 OVAs en caché
          const top10Ovas = filteredOvas.slice(0, 10);
          localStorage.setItem('cachedOvas', JSON.stringify(top10Ovas)); // Guardar en caché
          setOvas(top10Ovas);
        })
        .catch(error => console.error('Error fetching OVAs:', error));
    }
  };

  useEffect(() => {
    fetchAnimes("https://kitsu.io/api/edge/anime?sort=-startDate&limit=10"); // Limitar a 10 resultados
    fetchOvas("https://kitsu.io/api/edge/anime?sort=-startDate&limit=10"); // Limitar a 10 resultados
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

  return (
    <div id="container">
      <Nav goToAnimes={goToAnimes} goToHub={goToHub} />
      <main className="main-content main-anime">
        <nav className="anime-nav">
          <section className="animes nav-section">
            <div className="main-header">
              <h2 className="animes-header type">Animes</h2>
            </div>
            <div className="categories">
              <h3>Liked</h3>
              <h3>Popular</h3>
              <h3>Lists</h3>
            </div>
          </section>
          <div className="logo">
            <img src="https://imgs.search.brave.com/WMdhY3nR2Q7crN4VFsbPqghbZCKAZrt8AVCldx7SyTE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvT25l/LVBpZWNlLUxvZ28t/UE5HLVBpY3R1cmUu/cG5n" alt="logo página" />
          </div>
          <section className="mangas nav-section">
            <div className="main-header">
              <h2 className="mangas-header type">Mangas</h2>
            </div>
            <div className="categories">
              <h3>Liked</h3>
              <h3>Popular</h3>
              <h3>Lists</h3>
            </div>
          </section>
        </nav>
        <main id="main-anime-content">
          <div className="left-section">
            {animes.length > 0 ? (
              <article className="new-animes">
                <div id="left-arrow" className="left-arrow anime-arrow" onClick={goToPreviousAnime}>
                  <i className="fa-solid fa-arrow-left"></i>
                </div>
                <div className="anime-information-container">
                  {animes.map((anime, index) => (
                    <div
                      key={index}
                      className={`anime-information ${index === currentIndex ? 'active' : ''}`}
                    >
                      <div className="information-title">
                        <h4>{anime.attributes.titles.en || anime.attributes.titles.ja_jp}</h4>
                        <h5>{anime.attributes.startDate}</h5>
                      </div>
                      <img 
                        src={anime.attributes.coverImage.large || anime.attributes.posterImage.small} 
                        alt={anime.attributes.titles.en || anime.attributes.titles.ja_jp} 
                      />
                    </div>
                  ))}
                </div>
                <div id="right-arrow" className="right-arrow anime-arrow" onClick={goToNextAnime}>
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
                <div className="pagination-dots">
                  {animes.map((_, index) => (
                    <span 
                      key={index} 
                      className={`dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goToAnime(index)}
                    ></span>
                  ))}
                </div>
              </article>
            ) : (
              <p>Cargando animes recientes...</p>
            )}
            <article className='anime-films-ovas'>
              <h4>Anime Films / OVAS / Specials</h4>
              <div className="ovas-content">
                {ovas.length > 0 ? (
                  ovas.map((ova, index) => (
                    <div key={index} className="ova-item">
                      <img 
                        src={ova.attributes.posterImage.small} 
                        alt={ova.attributes.titles.en || ova.attributes.titles.ja_jp} 
                        />
                        <h5>{ova.attributes.titles.en || ova.attributes.titles.ja_jp}</h5>
                    </div>
                  ))
                ) : (
                  <p>Cargando OVAs, películas y especiales recientes...</p>
                )}
              </div>
              <div className="see-more"><i className="fa-solid fa-plus"></i></div>
            </article>
          </div>
          <div className="right-section">
            <article className='popular-animes'>
              <h4>Most Popular</h4>
              <div className="popular-information">
                <div className="rank">1</div>
                <div className="title">One Piece</div>
                <button className="like-button">👍</button>
                <button className="save-button">💌Save</button>
              </div>
            </article>
          </div>
        </main>
      </main>
    </div>
  );
}

export default AnimeMain;
