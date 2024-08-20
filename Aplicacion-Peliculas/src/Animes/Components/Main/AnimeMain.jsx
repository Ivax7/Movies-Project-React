import React, { useState, useEffect } from 'react';
import Nav from '../../../Home/Components/hooks/Nav';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AnimeMain.css';

function AnimeMain() {
  const [animes, setAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  function goToHub() {
    navigate('/'); 
  }

  function goToAnimes() {
    navigate('/animes'); 
  }

  const fetchAnimes = (url) => {
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

        console.log("Animes filtrados (más recientes):", filteredAnimes);

        if (filteredAnimes.length > 0) {
          setAnimes(prevAnimes => [...prevAnimes, ...filteredAnimes]);

          // Guardar en caché
          localStorage.setItem('cachedAnimes', JSON.stringify([...animes, ...filteredAnimes]));
        }

        if (animes.length + filteredAnimes.length < 10 && data.links.next) {
          setNextPage(data.links.next);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    const cachedAnimes = localStorage.getItem('cachedAnimes');
    if (cachedAnimes) {
      setAnimes(JSON.parse(cachedAnimes));
    } else {
      fetchAnimes("https://kitsu.io/api/edge/anime?sort=-startDate");
    }
  }, []);

  useEffect(() => {
    if (nextPage && animes.length < 10) {
      fetchAnimes(nextPage);
    }
  }, [nextPage, animes]);

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
              <h2 id="animes-header type">Animes</h2>
            </div>
            <div className="categories">
              <h3>Liked</h3>
              <h3>Popular</h3>
              <h3>Lists</h3>
            </div>
          </section>
          <div className="logo"><i className="fa-brands fa-slack"></i></div>
          <section className="mangas nav-section">
            <div className="main-header">
              <h2 id="mangas-header header">Mangas</h2>
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
