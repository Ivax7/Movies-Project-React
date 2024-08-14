// src/components/Hub/Hub.js
import React from 'react';
import "../../Styles/Hub.css";
import ContainerFilms from "../../../RecentFilms/Components/ContainerFilms/ContainerFilms";
import { useNavToggle } from '../hooks/nav';
import RandomHighRatedMovie from '../hooks/randomReview';
import CarrouselFilms from '../hooks/carrousel';

function Hub() {
  const { isTranslated, handleToggle } = useNavToggle();

  return (
    <div id="container">
      <nav className={isTranslated ? 'translate' : ''}>
        <div className="actions">
          <div className="profile circular">
            <button><i className="fa-regular fa-user"></i></button>
          </div>
          <div className="black-mode circular">
            <button><i className="fa-regular fa-moon"></i></button>
          </div>

          <div className={`desplegable ${isTranslated ? 'translate' : ''}`}>
            <button onClick={handleToggle}><i className="fa-solid fa-bars"></i></button>
          </div>
        </div>

        <button className="selector"><i className="fa-solid fa-house"></i><span>Home</span></button>
        <button className="selector"><i className="fa-solid fa-magnifying-glass"></i><span>Search</span></button>
        <button className="selector"><i className="fa-solid fa-film"></i><span>Lists</span></button>
        <button className="selector log-in"><i className="fa-solid fa-right-to-bracket"></i><span>Log-in</span></button>
      </nav>

      <main className="main-content">
        <div id="top-section">
          <RandomHighRatedMovie />
          <CarrouselFilms />
        </div>
        <div id="recent-films">
          <h2 className="recent-title">Most Recent Films</h2>
          <ContainerFilms />
        </div>
      </main>
    </div>
  );
}

export default Hub;
