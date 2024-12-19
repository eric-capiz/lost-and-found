import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { postService } from "../../services/postService";

export const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await postService.getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get user posts (for profile page)
  const getUserPosts = () => {
    return posts.filter((post) => post.userId._id === user?._id);
  };

  // Get unresolved posts (for home page)
  const getUnresolvedPosts = () => {
    return posts.filter((post) => post.status === "unresolved");
  };

  // Add new post
  const addPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Update post
  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  // Delete post
  const deletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const value = {
    posts,
    loading,
    error,
    getUserPosts,
    getUnresolvedPosts,
    addPost,
    updatePost,
    deletePost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
