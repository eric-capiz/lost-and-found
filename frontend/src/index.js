import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/main.scss";
import App from "./App";
import { AuthProvider } from "./contexts/auth/AuthContext";
import { UserProvider } from "./contexts/user/UserContext";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
