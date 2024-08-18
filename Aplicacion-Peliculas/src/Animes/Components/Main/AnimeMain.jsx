import React from 'react';
import Nav from '../../../Home/Components/hooks/Nav';
import { useNavigate } from 'react-router-dom';
import '../../Styles/AnimeMain.css'

function AnimeMain() {
  const navigate = useNavigate();

  function goToHub() {
    navigate('/'); // Navega a la página de Animes
  }

  function goToAnimes() {
    navigate('/animes'); // Navega a la página de Animes
  }


  return (
    <div id="container">
      <Nav goToAnimes={goToAnimes} goToHub={goToHub} /> {/* Pasa goToHub aquí */}
      <main className="main-content">
        <nav className="anime-nav">

          <section className="animes nav-section">
            <div className="main-header">
              <h2 id="animes-header">Animes</h2>
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
              <h2 id="mangas-header">Mangas</h2>
            </div>
            <div className="categories">
              <h3>Liked</h3>
              <h3>Popular</h3>
              <h3>Lists</h3>
            </div>
          </section>
        </nav>

        <main id="main-anime-content">
          <article className="new-animes">
            <div className="left-arrow">
              
            </div>
            <div className="anime-information">
              <h4>Anime Title</h4>
              <img src="" alt="" />
            </div>
            <div className="right-arrow">

            </div>

          </article>

          <article className='anime-films-ovas'>
            <h4>Anime Films / OVAS / Specials</h4>
            <div className="see-more"><i></i></div>
          </article>



          <article>
            <h4>Most Popular</h4>
            <div className="anime-information">
              <div className="rank">1</div>
              <div className="title">One Piece</div>
              <button className="like-button">👍</button>
              <button className="save-button">💌Save</button>

            </div>
          </article>
        </main>


      </main>
    </div>
  );
}

export default AnimeMain;
