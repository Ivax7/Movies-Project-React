// StarRating.js
import React from 'react';

const StarRating = ({ rating, className }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<i key={i} className="fas fa-star"></i>);
  }

  if (halfStar) {
    stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
  }

  return (
    <div className={`star-rating ${className}`}>
      {stars}
    </div>
  );
};

export default StarRating;
