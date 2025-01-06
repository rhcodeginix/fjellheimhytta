// utils/auth.js
export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("min_tomt_login");
    return token ? true : false;
  }
  return false;
};
