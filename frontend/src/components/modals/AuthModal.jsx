import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          <FiX className="close-button" onClick={onClose} />
        </div>

        <form>
          {isSignup && (
            <>
              <label>
                Name:
                <input type="text" required />
              </label>
              <label>
                Username:
                <input type="text" required />
              </label>
              <label>
                Profile Picture:
                <input type="file" accept="image/*" />
              </label>
              <label>
                Location:
                <input type="text" required />
              </label>
            </>
          )}
          <label>
            Username:
            <input type="text" required />
          </label>
          <label>
            Create Password:
            <input type="password" required />
          </label>
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>

        <p style={{ color: "white" }}>
          {isSignup ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignup(false)}
                style={{ cursor: "pointer", color: "#60a5fa" }}
              >
                Login
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignup(true)}
                style={{ cursor: "pointer", color: "#60a5fa" }}
              >
                Sign Up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
