
export function filterByDate(data) {
  const today = new Date();
  return data.filter(item => {
    const startDate = new Date(item.attributes.startDate);
    return startDate <= today;
  });
}
