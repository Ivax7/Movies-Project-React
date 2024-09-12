import { useState, useEffect } from "react";
import { IconCaretDownFilled, IconCaretUpFilled } from '@tabler/icons-react';

export function useOVAS() {
  const [ovas, setOvas] = useState([]);
  const [visibleOvasCount, setVisibleOvasCount] = useState(10);
  const [isMaxReached, setIsMaxReached] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para manejar reintentos en caso de errores de límite de velocidad
  const retryFetch = async (url, retries = 3) => {
    try {
      const response = await fetch(url);
      if (response.status === 429) { // Error 429: Too Many Requests
        console.log('Rate limit exceeded, retrying...');
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
          return retryFetch(url, retries - 1);
        } else {
          throw new Error('Rate limit exceeded and no retries left');
        }
      }
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error; // Re-lanzar el error después de todos los intentos
    }
  };

  // Función para obtener OVAs desde la API de Jikan
  const fetchOvas = async () => {
    const baseUrl = 'https://api.jikan.moe/v4/anime';
    let page = 1;
    let allFilteredOvas = [];
    const limit = 10; // Número de OVAs por página

    try {
      while (allFilteredOvas.length <= 20) {
        const url = `${baseUrl}?page=${page}&limit=${limit}&order_by=start_date&sort=desc`;
        const response = await retryFetch(url);
        const data = await response.json();

        const filteredOvas = data.data.filter(anime => {
          // Filtrar por tipo de OVA
          return anime.type === 'OVA' || anime.type === 'Movie' || anime.type === 'Special';
        });

        allFilteredOvas = allFilteredOvas.concat(filteredOvas);

        if (data.data.length < limit) break; // Salir si no hay más datos

        page++;
      }

      const top20Ovas = allFilteredOvas.slice(0, 20);
      localStorage.setItem('top20Ovas', JSON.stringify(top20Ovas));
      setOvas(top20Ovas); // Actualizamos el estado con los datos obtenidos
      setLoading(false); // Finalizamos la carga
    } catch (error) {
      console.error('Error fetching OVAs:', error);
      setLoading(false); // En caso de error, finalizamos la carga
    }
  };

  useEffect(() => {
    const storedOvas = localStorage.getItem('top20Ovas');
    if (storedOvas) {
      setOvas(JSON.parse(storedOvas));
      setLoading(false); // Datos cargados desde localStorage
    } else {
      fetchOvas();
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  // Función para convertir fechas al formato MM/DD/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

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
                src={ova.images?.jpg?.large_image_url || ''}
                alt={ova.title || 'No Title'}
              />
              <h5>{ova.title || 'No Title'}</h5>
              <p>{formatDate(ova.aired?.from) || 'Unknown'}</p>
              <p>{ova.type || 'Unknown'}</p>
            </div>
          ))
        )}
      </div>


      {ovas.length > 10 && (
        <div className="see-more" onClick={handleButtonClick}>
          {isMaxReached ? (
            <IconCaretUpFilled />
          ) : (
          <IconCaretDownFilled />
          )}
        </div>
      )}
    </article>
  );
}
