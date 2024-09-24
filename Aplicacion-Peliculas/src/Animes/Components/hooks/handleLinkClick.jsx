export const handleLinkClick = (anime) => {
  const url = `https://myanimelist.net/anime/${anime.mal_id}`;
  window.open(url, '__blank'); // Redirige al usuario a la URL
};