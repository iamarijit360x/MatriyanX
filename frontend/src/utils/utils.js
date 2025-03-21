
export const getMonthYear = (dateString) => {
    const [year, month] = dateString.split('-');
    const date = new Date(year, month-1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

export const formatDateForSQL = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  };