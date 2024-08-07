// StarRating.js

import React from 'react';

const StarRating = ({ rating }) => {
  // Determinar el número de estrellas llenas
  const fullStars = Math.floor(rating); // 4,78/5 => 4 estrellas llenas

  // Determinar si hay una estrella parcial
  const halfStar = rating % 1 !== 0;  // el 0,78 lo almacena como halfStar
  
  // Crear un array para generar las estrellas
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={i} className="fas fa-star"></i>); // generamos las estrellas enteras 
  }
  if (halfStar) {
    stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    // generamos las half
  }
  // Llenar el resto de las 5 estrellas
  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
  }

  return (
    <div className="star-rating">
      {stars}
    </div>
  );
};

export default StarRating;
