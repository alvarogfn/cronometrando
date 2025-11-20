export const getCurrentTimestamp = () => {
  return 1000 * Math.floor(Date.now() / 1000 + 0.1);
};
