import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axios from "axios";

const PostItem = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    state: "",
    itemType: "lost",
    category: [],
    tags: "",
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setSelectedImages(files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "images") {
          formDataToSend.append(key, formData[key]);
        }
      });

      selectedImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post("/api/posts", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created:", response.data);
      onClose();
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Post</h2>
          <FiX className="close-button" onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Post Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Details:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <div className="location-fields">
            <label>
              City:
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <label>
            Post Label:
            <div className="post-label">
              <label>
                <input
                  type="radio"
                  name="itemType"
                  value="lost"
                  checked={formData.itemType === "lost"}
                  onChange={handleChange}
                  required
                />
                Lost
              </label>
              <label>
                <input
                  type="radio"
                  name="itemType"
                  value="found"
                  checked={formData.itemType === "found"}
                  onChange={handleChange}
                  required
                />
                Found
              </label>
            </div>
          </label>
          <label>
            Category:
            <select
              name="category"
              value={formData.category}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions
                ).map((option) => option.value);
                setFormData((prev) => ({
                  ...prev,
                  category: selectedOptions,
                }));
              }}
              multiple
            >
              <option value="electronic">Electronic</option>
              <option value="jewelry">Jewelry</option>
              <option value="clothing">Clothing</option>
              <option value="pet">Pet</option>
              <option value="accessory">Accessory</option>
              <option value="keys">Keys</option>
            </select>
          </label>
          <label>
            Add Tags:
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags separated by commas"
            />
          </label>
          <label>
            Upload Image:
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
