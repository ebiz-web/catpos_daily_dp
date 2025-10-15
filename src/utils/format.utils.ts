export const formatNumber = (value: string | number): string => {
  let transValue =
    typeof value !== 'number'
      ? Number.parseInt(value.replace(/\D/g, '') || '0')
      : value;

  return transValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
