// src/components/Hub/Hub.jsx
import React from 'react';
import "../../Styles/Hub.css";
import ContainerFilms from "../../../RecentFilms/Components/ContainerFilms/ContainerFilms";
import RandomHighRatedMovie from '../hooks/randomReview';
import CarrouselFilms from '../hooks/carrousel';
import { useNavigate } from 'react-router-dom';
import Nav from '../hooks/Nav';

function Hub() {
  const navigate = useNavigate();

  function goToAnimes() {
    navigate('/animes'); // Navega a la página de Animes
  }

  function goToHub() {
    navigate('/'); // Navega a la página de Hub (Home)
  }

  return (
    <div id="container">
      <Nav goToAnimes={goToAnimes} goToHub={goToHub} />
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
