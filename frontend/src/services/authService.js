import axios from "axios";

// Set base URL for all axios requests
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const authService = {
  verifyToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get("/api/auth/verify");
    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post("/api/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  signup: async (formData) => {
    const response = await axios.post("api/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  },
};
