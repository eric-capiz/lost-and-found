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

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
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
              <span onClick={() => setIsAuthModalOpen(true)}>
                <FiPlusCircle /> Post Item
              </span>
              <span onClick={handleLogout}>
                Log Out
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
          {isAuthenticated ? (
            <>
              <span onClick={() => setIsAuthModalOpen(true)}>Post Item</span>
              <div className="icon-wrapper">
                <FiBell />
                <span className="notification-badge">3</span>
              </div>
              <Link to="/profile" className="user-profile">
                <img
                  src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                  alt="Profile"
                  className="avatar"
                />
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
    </>
  );
}

export default Navbar;
