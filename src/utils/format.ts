export const formatNumber = (num: number, minFractionDigits = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: minFractionDigits,
  });
};
