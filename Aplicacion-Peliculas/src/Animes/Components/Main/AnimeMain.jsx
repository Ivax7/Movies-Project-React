import { useState, useEffect } from 'react';
import Nav from '../../../Home/Components/hooks/Nav';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AnimeMain.css';
import { useRecentAnimes } from '../hooks/RecentAnimes';
import luffyImage from './luffy.png';

<img
  src={luffyImage}
  alt="logo página"
/>

function AnimeMain() {
  const navigate = useNavigate();
  const { animes, currentIndex, goToPreviousAnime, goToNextAnime, goToAnime } = useRecentAnimes();
  const [ovas, setOvas] = useState([]);
  const [visibleOvasCount, setVisibleOvasCount] = useState(5); // Número de OVAs visibles inicialmente

  function goToHub() {
    navigate('/');
  }

  function goToAnimes() {
    navigate('/animes');
  }

  const fetchOvas = async (url) => {
    let pageUrl = url;
    let allFilteredOvas = [];
    let totalFetchedOvas = 0;

    while (totalFetchedOvas < 30) {
      console.log(`Fetching page from URL:`, pageUrl);
      try {
        const response = await fetch(pageUrl);
        const data = await response.json();

        // Filtrar OVAs, películas y especiales cuya fecha de inicio no sea posterior a la fecha actual
        const filteredOvas = data.data.filter(ova => {
          const startDate = new Date(ova.attributes.startDate);
          const today = new Date();
          return (
            startDate <= today &&
            (ova.attributes.subtype === 'ONA' || ova.attributes.subtype === 'Movie' || ova.attributes.subtype === 'Special') &&
            ova.attributes.coverImage && ova.attributes.titles.en
          );
        });

        allFilteredOvas = allFilteredOvas.concat(filteredOvas);
        totalFetchedOvas = allFilteredOvas.length;

        pageUrl = data.links.next;
        if (!pageUrl) break;
      } catch (error) {
        console.error('Error fetching OVAs page:', error);
        break;
      }
    }

    const top30Ovas = allFilteredOvas.slice(0, 30);
    localStorage.setItem('top30Ovas', JSON.stringify(top30Ovas));
    setOvas(top30Ovas);
  };

  useEffect(() => {
    const storedOvas = localStorage.getItem('top30Ovas');
    if (storedOvas) {
      setOvas(JSON.parse(storedOvas));
    } else {
      fetchOvas("https://kitsu.io/api/edge/anime?sort=-startDate&limit=30");
    }
  }, []);

  const showMoreOvas = () => {
    setVisibleOvasCount(prevCount => prevCount + 5);
  };

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
          <img
            src={luffyImage}
            alt="logo página"
          />
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
                  ovas.slice(0, visibleOvasCount).map((ova, index) => (
                    <div key={index} className="ova-item">
                      <img
                        src={ova.attributes.posterImage.small}
                        alt={ova.attributes.titles.en || ova.attributes.titles.ja_jp}
                      />
                      <h5>{ova.attributes.titles.en || ova.attributes.titles.ja_jp}</h5>
                      <p className="ova-type">{ova.attributes.subtype}</p>
                    </div>
                  ))
                ) : (
                  <p>Cargando OVAs, películas y especiales recientes...</p>
                )}
              </div>
              {visibleOvasCount < ovas.length && (
                <div className="see-more" onClick={showMoreOvas}>
                  <i className="fa-solid fa-plus"></i>
                </div>
              )}
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
