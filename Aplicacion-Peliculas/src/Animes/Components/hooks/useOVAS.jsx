import { useState, useEffect } from "react";

export function useOVAS() {
  const [ovas, setOvas] = useState([]);
  const [visibleOvasCount, setVisibleOvasCount] = useState(5);

  const fetchOvas = async (url) => {
    let pageUrl = url;
    let allFilteredOvas = [];
    let totalFetchedOvas = 0;

    while (totalFetchedOvas < 30) {
      try {
        const response = await fetch(pageUrl);
        const data = await response.json();

        // Filtrar OVAs, películas y especiales cuya fecha de inicio no sea posterior a la fecha actual
        const filteredOvas = data.data.filter(ova => {
          const startDate = new Date(ova.attributes.startDate);
          const today = new Date();
          return (
            startDate <= today &&
            (ova.attributes.subtype === 'ONA' || ova.attributes.subtype === 'Movie' || ova.attributes.subtype === 'Special') &&
            ova.attributes.coverImage && ova.attributes.titles.en
          );
        });

        allFilteredOvas = allFilteredOvas.concat(filteredOvas);
        totalFetchedOvas = allFilteredOvas.length;

        pageUrl = data.links.next;
        if (!pageUrl) break;
      } catch (error) {
        console.error('Error fetching OVAs page:', error);
        break;
      }
    }

    const top30Ovas = allFilteredOvas.slice(0, 30);
    localStorage.setItem('top30Ovas', JSON.stringify(top30Ovas));
    setOvas(top30Ovas);
  };

  useEffect(() => {
    const storedOvas = localStorage.getItem('top30Ovas');
    if (storedOvas) {
      setOvas(JSON.parse(storedOvas));
    } else {
      fetchOvas("https://kitsu.io/api/edge/anime?sort=-startDate&limit=30");
    }
  }, []);

  const showMoreOvas = () => {
    setVisibleOvasCount(prevCount => prevCount + 5);
  };

  return {
    ovas,
    visibleOvasCount,
    showMoreOvas
  };
}
