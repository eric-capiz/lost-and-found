import React, { useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FaUserEdit, FaFilter, FaCog, FaPlus } from "react-icons/fa";
import Posts from "../components/posts/Posts";
import PostItem from "../components/modals/PostItem";
import EditProfile from "../components/modals/EditProfile";
import { UserContext } from "../contexts/user/UserContext";
import { AuthContext } from "../contexts/auth/AuthContext";
import { Spinner } from "../components/common";
import defaultAvatar from "../assets/images/avatar.png";
import defaultCover from "../assets/images/maze.jpg";

function Profile() {
  const location = useLocation();
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { loading: userLoading } = useContext(UserContext);
  const { user, loading: authLoading } = useContext(AuthContext);

  const openPostModal = () => setPostModalOpen(true);
  const closePostModal = () => setPostModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  if (authLoading || userLoading) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="profile-page">
      <div className="profile-info">
        <div className="cover-photo">
          <img
            src={user?.coverPic?.url || defaultCover}
            alt="Cover"
            className="cover-image"
          />
        </div>
        <img
          src={user?.profilePic?.url || defaultAvatar}
          alt="User Avatar"
          className="user-avatar"
        />
        <h2>{user?.username.toUpperCase()}</h2>
        <div className="button-group">
          <button className="edit-profile-button" onClick={openEditModal}>
            <FaUserEdit /> Edit Profile
          </button>
          <button className="create-post-button" onClick={openPostModal}>
            <FaPlus /> Create Post
          </button>
        </div>
      </div>
      <div className="subsections">
        <div className="user-stats">
          <h3>User Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Posts</h4>
              <p>{user?.postCount || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Unresolved</h4>
              <p>{user?.unresolvedCount || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Resolved</h4>
              <p>{user?.resolvedCount || 0}</p>
            </div>
            <div className="stat-card">
              <h4>Location</h4>
              <p>
                {user?.city && user?.state
                  ? `${user.city}, ${user.state}`
                  : "Location not set"}
              </p>
            </div>
            <div className="stat-card">
              <h4>Email</h4>
              <p>{user?.email || "Loading..."}</p>
            </div>
          </div>
        </div>

        <div className="posts-section">
          <h3>Posts</h3>
          <div className="posts-controls">
            <button className="filter-button">
              <FaFilter /> Filters
            </button>
          </div>
          <Posts />
        </div>
      </div>
      <PostItem isOpen={isPostModalOpen} onClose={closePostModal} />
      <EditProfile isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
}

export default Profile;
