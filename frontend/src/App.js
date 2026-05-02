import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/auth/AuthContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Footer from "./components/layout/Footer";

const AuthWrapper = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const AdminWrapper = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  const isAdmin = user && user.isAdmin;
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

function AppShell() {
  return (
    <div className="app app--luxe">
      <Navbar />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthWrapper />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route element={<AdminWrapper />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
