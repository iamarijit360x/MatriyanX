
export const getMonthYear = (dateString) => {
    const [year, month] = dateString.split('-');
    const date = new Date(year, month-1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };