export const getAxiosHeader = () => {
  const storedToken = localStorage.getItem("token");

  if (!storedToken) return;

  return {
    Authorization: `Bearer ${storedToken}`,
  };
};
