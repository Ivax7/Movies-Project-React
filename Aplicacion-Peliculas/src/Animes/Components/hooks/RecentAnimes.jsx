import { useState, useEffect } from "react";
import { filterByDate } from "./FilterByDate";

export function useRecentAnimes() {
  const [animes, setAnimes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchAnimes = async (url) => {
    let pageUrl = url;
    let allFilteredAnimes = [];

    while (allFilteredAnimes.length < 10) {
      try {
        const response = await fetch(pageUrl);
        const data = await response.json();

        // Filtrar animes cuya fecha de inicio no sea posterior a la fecha actual
        const filteredAnimes = filterByDate(data.data).filter(anime => {
          const status = anime.attributes.status;
          return (
            (status === 'current' || status === 'upcoming') &&
            anime.attributes.coverImage && anime.attributes.titles.en
          );
        });

        allFilteredAnimes = allFilteredAnimes.concat(filteredAnimes);

        if (allFilteredAnimes.length >= 10) {
          break;
        }

        pageUrl = data.links.next;
        if (!pageUrl) break;
      } catch (error) {
        console.error('Error fetching animes page:', error);
        break;
      }
    }

    const top10Animes = allFilteredAnimes.slice(0, 10);
    localStorage.setItem('top10Animes', JSON.stringify(top10Animes));
    setAnimes(top10Animes);
  };

  useEffect(() => {
    const storedAnimes = localStorage.getItem('top10Animes');
    if (storedAnimes) {
      setAnimes(JSON.parse(storedAnimes));
    } else {
      fetchAnimes("https://kitsu.io/api/edge/anime?sort=-startDate&limit=10");
    }
  }, []);

  const goToPreviousAnime = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? animes.length - 1 : prevIndex - 1));
    }
  };

  const goToNextAnime = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex === animes.length - 1 ? 0 : prevIndex + 1));
    }
  };

  const goToAnime = (index) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Duración de la transición

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return {
    animes,
    currentIndex,
    goToPreviousAnime,
    goToNextAnime,
    goToAnime,
  };
}
