import { createContext, useState, useContext, useEffect } from "react";
import { postService } from "../../services/postService";
import { AuthContext } from "../auth/AuthContext";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        console.log("Fetching posts...");
        const data = await postService.getAllPosts();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (err) {
        console.error("Error details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch posts if user is authenticated
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

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

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        getUnresolvedPosts,
        getUserPosts,
        addPost,
        updatePost,
        deletePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
