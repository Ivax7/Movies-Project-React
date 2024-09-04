import { useState, useEffect } from "react";

export function useOVAS() {
  const [ovas, setOvas] = useState([]);
  const [visibleOvasCount, setVisibleOvasCount] = useState(10);
  const [isMaxReached, setIsMaxReached] = useState(false);
  const [loading, setLoading] = useState(true); // Estado para la imagen de carga

  const fetchOvas = async (url) => {
    let pageUrl = url;
    let allFilteredOvas = [];
    let totalFetchedOvas = 0;

    try {
      while (totalFetchedOvas <= 20) {
        const response = await fetch(pageUrl);
        const data = await response.json();

        const filteredOvas = data.data.filter(ova => {
          const startDate = new Date(ova.attributes.startDate);
          const today = new Date();
          return (
            startDate <= today 
          );
        });

        allFilteredOvas = allFilteredOvas.concat(filteredOvas);
        totalFetchedOvas = allFilteredOvas.length;

        pageUrl = data.links.next;
        if (!pageUrl) break;
      }

      const top20Ovas = allFilteredOvas.slice(0, 20);
      localStorage.setItem('top20Ovas', JSON.stringify(top20Ovas));
      setOvas(top20Ovas); // Actualizamos el estado con los datos obtenidos
      setLoading(false); // Finalizamos la carga
    } catch (error) {
      console.error('Error fetching OVAs page:', error);
      setLoading(false); // En caso de error, finalizamos la carga
    }
  };

  const date = new Date();
  const today = date.toISOString().split('T')[0]; // Formato de fecha 'YYYY-MM-DD'
  
  useEffect(() => {
    const storedOvas = localStorage.getItem('top20Ovas');
    if (storedOvas) {
      setOvas(JSON.parse(storedOvas));
      setLoading(false); // Datos cargados desde localStorage
    } else {
      console.log(today);
      fetchOvas(`https://kitsu.io/api/edge/anime?filter[subtype]=OVA,Movie,Special&sort=-startDate`);
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  const handleButtonClick = () => {
    if (isMaxReached) {
      setVisibleOvasCount(10);
      setIsMaxReached(false);
    } else {
      setVisibleOvasCount(prevCount => {
        const newCount = prevCount + 5;
        if (newCount >= 20) {
          setIsMaxReached(true);
          return 20;
        }
        return newCount;
      });
    }
  };

  return (
    <article className="anime-films-ovas">
      <h4>Anime Films / OVAS / Specials</h4>
      <div className="ovas-content">
        {loading ? (
          <div className="loading-ovas">
            <img src="https://i.pinimg.com/originals/42/a4/5f/42a45f81c257479ae3536035a0097abb.gif" alt="Cargando..." />
            <p>Loading Content</p>
          </div>
        ) : (
          ovas.slice(0, visibleOvasCount).map((ova, index) => (
            <div key={index} className="ova-item">
              <img
                src={ova.attributes.posterImage.small}
                alt={ova.attributes.titles.en || ova.attributes.titles.ja_jp}
              />
              <h5>{ova.attributes.titles.en || ova.attributes.titles.ja_jp}</h5>
              <p>{ova.attributes.startDate}</p>
              <p>{ova.attributes.subtype}</p>
            </div>
          ))
        )}
      </div>

      {ovas.length > 10 && (
        <div className="see-more" onClick={handleButtonClick}>
          {isMaxReached ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-caret-up">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M11.293 7.293a1 1 0 0 1 1.32 -.083l.094 .083l6 6l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059l-.002 .059l-.005 .058l-.009 .06l-.01 .052l-.032 .108l-.027 .067l-.07 .132l-.065 .09l-.073 .081l-.094 .083l-.077 .054l-.096 .054l-.036 .017l-.067 .027l-.108 .032l-.053 .01l-.06 .01l-.057 .004l-.059 .002h-12c-.852 0 -1.297 -.986 -.783 -1.623l.076 -.084l6 -6z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-caret-down">
              <path stroke="none" d="M0 0h24V0H0z" fill="none"/>
              <path d="M18 9c.852 0 1.297 .986 .783 1.623l-.076 .084l-6 6a1 1 0 0 1 -1.32 .083l-.094 -.083l-6 -6l-.083 -.094l-.054 -.077l-.054 -.096l-.017 -.036l-.027 -.067l-.032 -.108l-.01 -.053l-.01 -.06l-.004 -.057v-.118l.005 -.058l.009 -.06l.01 -.052l.032 -.108l.027 -.067l.07 -.132l.065 -.09l.073 -.081l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01l.057 -.004l12.059 -.002z" />
            </svg>
          )}
        </div>
      )}
    </article>
  );
}
