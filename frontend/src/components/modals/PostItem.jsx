import React from "react";
import { FiX } from "react-icons/fi";

const PostItem = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Post</h2>
          <FiX className="close-button" onClick={onClose} />
        </div>

        <form>
          <label>
            Post Title:
            <input type="text" required />
          </label>
          <label>
            Details:
            <textarea required></textarea>
          </label>
          <label>
            Last Known Location:
            <input type="text" required />
          </label>
          <label>
            Post Label:
            <div className="post-label">
              <label>
                <input type="radio" name="postLabel" value="lost" required />
                Lost
              </label>
              <label>
                <input type="radio" name="postLabel" value="found" required />
                Found
              </label>
            </div>
          </label>
          <label>
            Category:
            <select multiple>
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
            <input type="text" placeholder="Enter tags separated by commas" />
          </label>
          <label>
            Upload Image:
            <input type="file" accept="image/*" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;
