// src/components/Nav/Nav.jsx
import React from 'react';
import "../../Styles/Hub.css";
import { useNavToggle } from './useNavToggle';

function Nav({ goToAnimes, goToHub }) { // Agrega goToHub como prop
  const { isTranslated, handleToggle } = useNavToggle(); // Usa el hook directamente

  return (
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

      {/* Llama a goToHub al hacer clic en Home */}
      <button className="selector" onClick={goToHub}>
        <i className="fa-solid fa-house"></i><span>Home</span>
      </button>
      <button className="selector"><i className="fa-solid fa-magnifying-glass"></i><span>Search</span></button>
      <button className="selector"><i className="fa-solid fa-list"></i><span>Lists</span></button>
      <button className="selector animes" onClick={goToAnimes}>
        <i>
          <img src="https://imgs.search.brave.com/WMdhY3nR2Q7crN4VFsbPqghbZCKAZrt8AVCldx7SyTE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvT25l/LVBpZWNlLUxvZ28t/UE5HLVBpY3R1cmUu/cG5n" 
            alt="Animes" 
            className="one-piece"/>
        </i>
        <span>Animes</span>
      </button>
      <button className="selector log-off"><i className="fa-solid fa-right-to-bracket"></i><span>Log-Off</span></button>
    </nav>
  );
}

export default Nav;
