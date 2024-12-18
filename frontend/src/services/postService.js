import axios from "axios";

export const postService = {
  // Create post
  createPost: async (formData) => {
    const response = await axios.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAllPosts: async () => {
    const response = await axios.get("/api/posts");
    return response.data;
  },

  getPost: async (postId) => {
    const response = await axios.get(`/api/posts/${postId}`);
    return response.data;
  },

  updatePost: async (postId, formData) => {
    const response = await axios.put(`/api/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updatePostStatus: async (postId, status) => {
    const response = await axios.patch(`/api/posts/${postId}/status`, {
      status,
    });
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await axios.delete(`/api/posts/${postId}`);
    return response.data;
  },
};
