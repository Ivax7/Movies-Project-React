import { useState, useEffect } from "react";
import { IconCaretDownFilled, IconCaretUpFilled } from '@tabler/icons-react';
import { handleLinkClick } from "./handleLinkClick";

export function useOVAS() {
  const [ovas, setOvas] = useState([]);
  const [visibleOvasCount, setVisibleOvasCount] = useState(10);
  const [isMaxReached, setIsMaxReached] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para obtener las fechas formateadas
  function getFormattedDates() {
    const today = new Date(); // Obtiene la fecha actual
    const currentYear = today.getFullYear(); // Obtiene el año actual
    
    // Crea una nueva fecha para el 1 de enero del año actual
    const firstDayOfYear = new Date(currentYear, 0, 1); 

    // Formatea las fechas a YYYY-MM-DD
    const firstDayFormatted = `${firstDayOfYear.getFullYear()}-${String(firstDayOfYear.getMonth() + 1).padStart(2, '0')}-${String(firstDayOfYear.getDate()).padStart(2, '0')}`;
    const currentDateFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return {
      firstDayFormatted,
      currentDateFormatted
    };
  }

  const { firstDayFormatted, currentDateFormatted } = getFormattedDates();

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
      while (allFilteredOvas.length < 20) { // Continuar hasta encontrar 20 OVAs
        const url = `${baseUrl}?start_date=${firstDayFormatted}&end_date=${currentDateFormatted}&page=${page}&limit=${limit}&order_by=start_date&sort=desc`;
        const response = await retryFetch(url);
        const data = await response.json();

        // Verificamos que hay datos antes de filtrarlos
        if (data.data && data.data.length > 0) {
          const filteredOvas = data.data.filter(anime => {
            // Filtrar por tipo de OVA, Película o Especial y evitar Hentai
            const isOvaOrMovieOrSpecial = anime.type === 'ONA' || anime.type === 'Movie' || anime.type === 'Special';
            const isNotHentai = !anime.genres.some(genre => genre.name.toLowerCase() === 'hentai'); // Filtrar por género
            const existsInOvas = allFilteredOvas.some(existingAnime => existingAnime.mal_id === anime.mal_id);
            
            // Solo añadir si es OVA, Película o Especial, no existe ya y no es Hentai
            return isOvaOrMovieOrSpecial && isNotHentai && !existsInOvas;
          });

          // Usar spread operator para añadir los elementos filtrados
          allFilteredOvas = [...allFilteredOvas, ...filteredOvas];

          // Verificar si hemos alcanzado el número deseado de OVAs
          if (allFilteredOvas.length >= 20) {
            break; // Salir del bucle si hemos encontrado suficientes OVAs
          }
        }

        // Salir si no hay más datos
        if (data.data.length < limit) break;

        page++; // Aumentar la página para continuar la búsqueda
      }

      // Eliminamos duplicados y limitamos a 20 elementos únicos
      const uniqueOvas = Array.from(new Map(allFilteredOvas.map(ova => [ova.mal_id, ova])).values()).slice(0, 20);
      localStorage.setItem('top20Ovas', JSON.stringify(uniqueOvas));
      setOvas(uniqueOvas); // Actualizamos el estado con los datos obtenidos
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
        if (newCount >= 20) { // Cambiar a 20
          setIsMaxReached(true);
          return 20; // Cambiar a 20
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
          ovas.slice(0, visibleOvasCount).map((ova) => (
            <div key={ova.mal_id} className="ova-item" onClick={() => handleLinkClick(ova)}> {/* Agregar el evento onClick */}
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

      {ovas.length > 10 && ( // Cambiar a 10 para mostrar el botón
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
