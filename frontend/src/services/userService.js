import axios from "axios";
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

export const userService = {
  updateProfile: async (formData) => {
    const response = await axios.put("/api/users/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
  },

  getUserStats: (userPosts) => {
    if (!userPosts) return { total: 0, resolved: 0, unresolved: 0 };

    return {
      total: userPosts.length,
      resolved: userPosts.filter((post) => post.status === "resolved").length,
      unresolved: userPosts.filter((post) => post.status === "unresolved")
        .length,
    };
  },
};
