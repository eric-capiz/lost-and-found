import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiCompass,
  FiPlusCircle,
  FiUser,
} from "react-icons/fi";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-mobile">
        <h1 className="logo">Lost & Found</h1>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search for lost or found items..." />
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <Link to="/browse">
          <FiCompass /> Browse
        </Link>
        <Link to="/post">
          <FiPlusCircle /> Post Item
        </Link>
        <Link to="/settings">
          <FiSettings /> Settings
        </Link>
        <Link to="/profile">
          <FiUser /> Profile
        </Link>
      </div>

      <div className="navbar-left">
        <Link to="/" className="logo">
          Lost & Found
        </Link>
        <div className="nav-links">
          <Link to="/browse">Browse</Link>
          <Link to="/post">Post Item</Link>
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search for lost or found items..." />
        </div>
      </div>

      <div className="navbar-right">
        <div className="nav-icons">
          <div className="icon-wrapper">
            <FiBell />
            <span className="notification-badge">3</span>
          </div>
          <div className="icon-wrapper">
            <FiSettings />
          </div>
        </div>

        <Link to="/profile" className="user-profile">
          <img
            src="https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Profile"
            className="avatar"
          />
          <span className="user-name">John Doe</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
