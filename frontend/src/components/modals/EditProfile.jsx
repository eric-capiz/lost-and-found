import React, { useState, useEffect, useContext } from "react";
import { FiX } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth/AuthContext";

const EditProfile = ({ isOpen, onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    city: "",
    state: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        city: user.city || "",
        state: user.state || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files[0]) {
      if (type === "profile") {
        setProfilePic(e.target.files[0]);
      } else if (type === "cover") {
        setCoverPic(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const updateData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] && formData[key] !== user[key]) {
          updateData.append(key, formData[key]);
        }
      });

      if (profilePic) {
        updateData.append("profilePic", profilePic);
      }

      if (coverPic) {
        updateData.append("coverPic", coverPic);
      }

      if ([...updateData.entries()].length > 0) {
        await updateUser(updateData);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <FiX className="close-button" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          <label>
            Profile Picture:
            <div className="image-preview">
              {user?.profilePic?.url && (
                <img
                  src={user.profilePic.url}
                  alt="Current profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "profile")}
            />
          </label>

          <label>
            Cover Photo:
            <div className="image-preview">
              {user?.coverPic?.url && (
                <img
                  src={user.coverPic.url}
                  alt="Current cover"
                  style={{
                    width: "200px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "cover")}
            />
          </label>

          <label>
            New Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
          </label>

          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>

          <label>
            State:
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </label>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
