// src/components/Nav/Nav.jsx
import React from 'react';
import "../../Styles/Hub.css";
import { useNavToggle } from './useNavToggle';
import { NavButton } from './NavButton';

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

      {/* Uso de NavButton para diferentes secciones */}
      <NavButton 
        iconClass="fa-solid fa-house" 
        text="Home" 
        onClick={goToHub} 
      />
      <NavButton 
        iconClass="fa-solid fa-magnifying-glass" 
        text="Search" 
      />
      <NavButton 
        iconClass="fa-solid fa-list" 
        text="Lists" 
      />
      <NavButton 
        imgSrc="https://imgs.search.brave.com/WMdhY3nR2Q7crN4VFsbPqghbZCKAZrt8AVCldx7SyTE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMTMvT25l/LVBpZWNlLUxvZ28t/UE5HLVBpY3R1cmUu/cG5n" 
        imgAlt="One piece" 
        text="Animes" 
        onClick={goToAnimes} 
      />
      <NavButton 
        iconClass="fa-solid fa-right-to-bracket" 
        text="Log-Off" 
      />
    </nav>
  );
}

export default Nav;
