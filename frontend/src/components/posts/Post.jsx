import { useState, useContext } from "react";
import { FaRegComment, FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../contexts/auth/AuthContext";
import { format } from "date-fns";

function Post({ post }) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(AuthContext);

  const isOwner = user?._id === post.userId._id;

  return (
    <article className="post">
      <div className="post-header">
        <div className="user-info">
          <img
            src={user?.profilePic?.url}
            alt={post.userId.username}
            className="profile-pic"
          />
          <div className="user-details">
            <h3>{post.userId.username}</h3>
            <div className="post-meta">
              <span>{format(new Date(post.createdAt), "MM/dd/yyyy")}</span>
              <span>•</span>
              <span>
                {post.city}, {post.state}
              </span>
              <span>•</span>
              <span>{post.status.toUpperCase()}</span>
              <span>•</span>
              <span>{post.category.toUpperCase()}</span>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="post-actions">
            <button className="icon-button">
              <FaEdit className="edit-icon" />
            </button>
            <button className="icon-button">
              <FaTrash className="delete-icon" />
            </button>
          </div>
        )}
      </div>

      <div className="post-content">
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        {post.images && post.images.length > 0 && (
          <img src={post.images[0].url} alt="Post" className="post-image" />
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            <span className="tags-label">Tags:</span>
            <div className="tags-container">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag-pill">
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="post-footer">
        <span className="comment-count">{post.commentCount} Comments</span>
        <button
          className="comment-button"
          onClick={() => setShowComments(!showComments)}
        >
          <FaRegComment className="comment-icon" />
          <span>Comment</span>
        </button>
      </div>
    </article>
  );
}

export default Post;
