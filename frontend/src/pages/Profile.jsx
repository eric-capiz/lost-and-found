import React from "react";
import { FaUserEdit, FaFilter, FaCog, FaPlus } from "react-icons/fa";
import Posts from "../components/posts/Posts";

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-info">
        <div className="cover-photo">
          <img
            src="https://media.istockphoto.com/id/2082196734/photo/man-walking-in-abstract-maze.webp?a=1&b=1&s=612x612&w=0&k=20&c=hqU7aS1vh_0iz2JV2F-qzKXmR_9Vx6V-QSmeE-7fWtg="
            alt="Cover"
            className="cover-image"
          />
        </div>
        <img
          src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
          alt="User Avatar"
          className="user-avatar"
        />
        <h2>Breezy</h2>
        <div className="button-group">
          <button className="edit-profile-button">
            <FaUserEdit /> Edit Profile
          </button>
          <button className="create-post-button">
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
              <p>10</p>
            </div>
            <div className="stat-card">
              <h4>Unresolved</h4>
              <p>2</p>
            </div>
            <div className="stat-card">
              <h4>Resolved</h4>
              <p>8</p>
            </div>
            <div className="stat-card">
              <h4>Location</h4>
              <p>Chicago, Illinois</p>
            </div>
            <div className="stat-card">
              <h4>Email</h4>
              <p>breezy@example.com</p>
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
    </div>
  );
}

export default Profile;
