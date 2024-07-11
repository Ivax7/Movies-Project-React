import React from 'react';

function Img({ src, alt }) {
  return (
    <img 
      className="film-image"
      src={src}
      alt={alt}
    />
  );
}

export default Img