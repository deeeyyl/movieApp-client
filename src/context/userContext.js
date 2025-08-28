import React, { createContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, isAdmin }

  // On mount, read token from localStorage and decode
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          email: payload.email,
          isAdmin: payload.isAdmin === true || payload.isAdmin === "true",
        });
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        email: payload.email,
        isAdmin: payload.isAdmin === true || payload.isAdmin === "true",
      });
    } catch (err) {
      console.error("Invalid token on login", err);
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;