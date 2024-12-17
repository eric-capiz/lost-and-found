import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
// Set base URL for all axios requests
axios.defaults.baseURL =
  (process.env.REACT_APP_API_URL || "http://localhost:5000") + "/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          // Set default axios header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          // Verify token with backend
          const response = await axios.get("/api/auth/verify");

          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          console.log("No token found"); // Debug log
        }
      } catch (err) {
        console.error("Token verification failed:", err); // Debug log
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/api/auth/login", credentials);

      console.log("Login response:", response.data); // Debug log

      if (response.data.token) {
        console.log("Saving token to localStorage"); // Debug log
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data);
        setIsAuthenticated(true);

        // Verify token was saved
        const savedToken = localStorage.getItem("token");
      }

      return response.data;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Log to verify data
      console.log("Signup response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        throw new Error("No token received");
      }

      return response.data;
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        setError,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
