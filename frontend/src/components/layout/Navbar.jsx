import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/auth/AuthContext";
import { useSearch } from "../../contexts/search/SearchContext";
import { useNotifications } from "../../contexts/notification/NotificationContext";
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
import NotificationMenu from "../notification/NotificationMenu";

function Navbar() {
  const { isAuthenticated, logout, user, loading } = useContext(AuthContext);
  const { searchQuery, setSearchQuery } = useSearch();
  const { notificationCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-mobile">
          <Link
            to="/"
            className="logo"
            onClick={() => {
              closeMobileMenu();
            }}
          >
            Lost & Found
          </Link>
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
              <Link to="/profile" onClick={closeMobileMenu}>
                <FiUser /> Profile
              </Link>
              <span
                onClick={() => {
                  setIsPostModalOpen(true);
                  closeMobileMenu();
                }}
              >
                <FiPlusCircle /> Post Item
              </span>
              <span
                className="logout-button"
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
              >
                <FiLogOut /> Logout
              </span>
            </>
          ) : (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                closeMobileMenu();
              }}
            >
              Login / Signup
            </button>
          )}
        </div>

        <div className="navbar-search navbar-search--mobile" role="search">
          <FiSearch className="search-icon" aria-hidden />
          <input
            type="search"
            placeholder="Search listings…"
            aria-label="Search listings"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="navbar-content">
          <Link to="/" className="logo">
            Lost & Found
          </Link>

          <div className="navbar-search navbar-search--desktop" role="search">
            <FiSearch className="search-icon" aria-hidden />
            <input
              type="search"
              placeholder="Search listings…"
              aria-label="Search listings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="navbar-actions navbar-actions--loading">
              <div className="loading-spinner" />
            </div>
          ) : isAuthenticated ? (
            <div className="navbar-actions">
              <span onClick={() => setIsPostModalOpen(true)}>Post Item</span>
              <div className="icon-wrapper">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                  aria-label="Notifications"
                >
                  <FiBell />
                  {notificationCount > 0 && (
                    <span className="notification-badge">
                      {notificationCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <NotificationMenu
                    userId={user._id}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
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
              <button
                type="button"
                onClick={handleLogout}
                className="logout-button"
                aria-label="Log out"
              >
                <FiLogOut />
              </button>
            </div>
          ) : (
            <div className="navbar-actions">
              <button
                type="button"
                className="login-signup-button"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Login / Signup
              </button>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <PostItem isOpen={isPostModalOpen} onClose={closePostModal} />
    </>
  );
}

export default Navbar;
