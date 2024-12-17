import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchUserProfile = async () => {
    try {
      console.log("Fetching user profile for:", user);
      const response = await axios.get(`/api/users/${user.id}`);
      console.log("User profile response:", response.data);
      setUserProfile(response.data.user);
      setUserPosts(response.data.posts);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  const getUserStats = () => {
    if (!userPosts) return { total: 0, resolved: 0, unresolved: 0 };

    return {
      total: userPosts.length,
      resolved: userPosts.filter((post) => post.status === "resolved").length,
      unresolved: userPosts.filter((post) => post.status === "unresolved")
        .length,
    };
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        userPosts,
        loading,
        error,
        getUserStats,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
