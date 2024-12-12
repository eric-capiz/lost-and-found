import { Link } from "react-router-dom";
import { FiSearch, FiSettings } from "react-icons/fi";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
          Lost & Found
        </Link>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/login" className="nav-link">
          Login
        </Link>
        <Link to="/register" className="nav-link">
          Register
        </Link>
        <FiSettings className="settings-icon" />
      </div>
    </nav>
  );
}

export default Navbar;
