export function getFormattedDates() {
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