import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Footer from "./components/layout/Footer";

const AuthWrapper = () => {
  const isAuthenticated = true; // This will come from auth context

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AdminWrapper = () => {
  const isAdmin = false; // This will come from auth context

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="page-container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected User Routes */}
            <Route element={<AuthWrapper />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* Protected Admin Routes */}
            <Route element={<AdminWrapper />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
