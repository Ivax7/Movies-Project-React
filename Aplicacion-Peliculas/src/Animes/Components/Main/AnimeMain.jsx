import Nav from '../../../Home/Components/hooks/Nav';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AnimeMain.css';
import { useOVAS } from '../hooks/useOVAS';  // Importamos el hook para OVAs
import { useTopRankedAnimes } from '../hooks/useRecentAnimes';
import luffyImage from './luffy.png';
import { useMostPopular } from '../hooks/useMostPopular';
function AnimeMain() {
  const navigate = useNavigate();

  const recentAnimesComponent = useTopRankedAnimes();  // Obtenemos el componente JSX de animes recientes
  const OVASComponent = useOVAS();  // Obtenemos el componente JSX de animes recientes
  const mostPopularComponent = useMostPopular();  // Obtenemos el componente JSX de animes recientes


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
          {/* Animes Recientes y OVAS */}
          <div className="left-section">
            {recentAnimesComponent}
            {OVASComponent}            
          </div>

          {mostPopularComponent}


        </main>
      </main>
    </div>
  );
}

export default AnimeMain;
