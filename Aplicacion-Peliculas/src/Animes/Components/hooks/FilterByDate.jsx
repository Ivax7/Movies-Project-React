// FilterByDate.jsx
export function filterByDate(animeList) {
  const today = new Date();

  return animeList.filter(item => {
    // Accede a la propiedad 'aired.from' y verifica si existe
    const startDate = item.aired?.from ? new Date(item.aired.from) : null;

    // Asegúrate de que startDate sea una fecha válida y que no sea posterior a la fecha actual
    return startDate && startDate <= today;
  });
}