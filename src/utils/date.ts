export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatMonthLabel = (month: number): string =>
  new Date(2020, month - 1, 1).toLocaleString(undefined, { month: 'short' });
