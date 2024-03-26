import axios from "axios";

export const useAxios = (token) => {
  const instance = axios.create({
    baseURL: "${process.env.REACT_APP_BASE_URL}",
    // baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
  });
  return instance;
};
