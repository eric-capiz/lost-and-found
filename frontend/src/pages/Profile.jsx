import React, { useState, useContext } from "react";
import { FaUserEdit, FaFilter, FaCog, FaPlus } from "react-icons/fa";
import Posts from "../components/posts/Posts";
import PostItem from "../components/modals/PostItem";
import EditProfile from "../components/modals/EditProfile";
import { UserContext } from "../contexts/user/UserContext";
import { AuthContext } from "../contexts/auth/AuthContext";

function Profile() {
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { userProfile, getUserStats } = useContext(UserContext);
  const { user } = useContext(AuthContext);

  const stats = getUserStats();

  const openPostModal = () => setPostModalOpen(true);
  const closePostModal = () => setPostModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  return (
    <div className="profile-page">
      <div className="profile-info">
        <div className="cover-photo">
          <img
            src={
              user?.coverPic?.url ||
              "https://media.istockphoto.com/id/2082196734/photo/man-walking-in-abstract-maze.webp?b=1&s=612x612&w=0&k=20&c=hqU7aS1vh_0iz2JV2F-qzKXmR_9Vx6V-QSmeE-7fWtg="
            }
            alt="Cover"
            className="cover-image"
          />
        </div>
        <img
          src={user?.profilePic?.url}
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
              <p>{user?.postCount}</p>
            </div>
            <div className="stat-card">
              <h4>Unresolved</h4>
              <p>{stats.unresolved}</p>
            </div>
            <div className="stat-card">
              <h4>Resolved</h4>
              <p>{stats.resolved}</p>
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
            <button className="manage-posts-button">
              <FaCog /> Manage Posts
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
