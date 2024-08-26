import Nav from '../../../Home/Components/hooks/Nav';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AnimeMain.css';
import { useOVAS } from '../hooks/useOVAS';  // Importamos el hook para OVAs
import { useRecentAnimes } from '../hooks/useRecentAnimes';
import luffyImage from './luffy.png';

function AnimeMain() {
  const navigate = useNavigate();
  const { ovas, visibleOvasCount, showMoreOvas } = useOVAS();  // Obtenemos datos y funciones del hook

  const recentAnimesComponent = useRecentAnimes();  // Obtenemos el componente JSX de animes recientes


  function goToHub() {
    navigate('/');
  }

  function goToAnimes() {
    navigate('/animes');
  }

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
            {recentAnimesComponent}
            {/* Renderizado del contenido de OVAs */}
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
