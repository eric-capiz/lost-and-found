import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth/AuthContext";
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import AuthModal from "../modals/AuthModal";
import PostItem from "../modals/PostItem";

function Navbar() {
  const { isAuthenticated, logout, user, loading } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-mobile">
          <h1 className="logo">Lost & Found</h1>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          {isAuthenticated ? (
            <>
              <Link to="/profile">
                <FiUser /> Profile
              </Link>
              <span onClick={() => setIsPostModalOpen(true)}>
                <FiPlusCircle /> Post Item
              </span>
              <span className="logout-button" onClick={handleLogout}>
                <FiLogOut /> Logout
              </span>
            </>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)}>
              Login / Signup
            </button>
          )}
        </div>

        <div className="navbar-content">
          <Link to="/" className="logo">
            Lost & Found
          </Link>
          {loading ? (
            <div className="loading-spinner">
              {/* You can add a spinner component here */}
            </div>
          ) : isAuthenticated ? (
            <>
              <span onClick={() => setIsPostModalOpen(true)}>Post Item</span>
              <div className="icon-wrapper">
                <FiBell />
                <span className="notification-badge">3</span>
              </div>
              <Link to="/profile" className="user-profile">
                {user?.profilePic?.url ? (
                  <img
                    src={user.profilePic.url}
                    alt="Profile"
                    className="avatar"
                  />
                ) : (
                  <span className="view-profile">
                    <FiUser /> View Profile
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <FiLogOut />
              </button>
            </>
          ) : (
            <button
              className="login-signup-button"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login / Signup
            </button>
          )}
        </div>

        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search for items..." />
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <PostItem isOpen={isPostModalOpen} onClose={closePostModal} />
    </>
  );
}

export default Navbar;
