import React from "react";
import { FiX } from "react-icons/fi";

const EditProfile = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <FiX className="close-button" onClick={onClose} />
        </div>

        <form>
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
            Password:
            <input type="password" required />
          </label>
          <label>
            Location:
            <input type="text" required />
          </label>
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
