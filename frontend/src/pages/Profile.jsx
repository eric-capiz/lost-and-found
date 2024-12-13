import React, { useState } from "react";
import { FaPlus, FaUserEdit, FaFilter, FaCog } from "react-icons/fa"; // Import icons
import Posts from "../components/posts/Posts"; // Import the Posts component

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="profile-page">
        <div className="cover-photo">
          <img
            src="https://media.istockphoto.com/id/2082196734/photo/man-walking-in-abstract-maze.webp?a=1&b=1&s=612x612&w=0&k=20&c=hqU7aS1vh_0iz2JV2F-qzKXmR_9Vx6V-QSmeE-7fWtg="
            alt="Cover"
            className="cover-image"
          />
        </div>
        <div className="user-details">
          <img
            src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
            alt="User Avatar"
            className="user-avatar"
          />
          <h2>Breezy</h2>
          <div className="button-group">
            <button className="create-post-button">
              <FaPlus /> Create Post
            </button>
            <button className="edit-profile-button">
              <FaUserEdit /> Edit Profile
            </button>
          </div>
        </div>
        <div className="intro-section">
          <h3>Intro</h3>
          <p>Total Posts: 10</p>
          <p>Unresolved Posts: 2</p>
          <p>Resolved Posts: 8</p>
          <p>Location: Chicago, Illinois</p>
          <p>Email: breezy@example.com</p>
        </div>
        <div className="create-post-section" onClick={handleOpenModal}>
          <input
            type="text"
            placeholder="Create Post"
            className="create-post-input"
            readOnly
          />
        </div>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseModal}>
                &times;
              </span>
              <h2>Create Post</h2>
            </div>
          </div>
        )}

        {/* Posts Section */}
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
        </div>
      </div>
      <Posts />
    </>
  );
}

export default Profile;
