import { useState, useContext } from "react";
import { FaRegComment, FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../contexts/auth/AuthContext";

function Post({ post }) {
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(AuthContext);

  const isOwner = user?._id === post.userId;

  return (
    <article className="post">
      <div className="post-header">
        <div className="user-info">
          <img
            src={post.user.profilePic}
            alt={post.user.name}
            className="profile-pic"
          />
          <div className="user-details">
            <h3>{post.user.name}</h3>
            <div className="post-meta">
              <span>{post.timestamp}</span>
              <span>•</span>
              <span>{post.location}</span>
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
        <p>{post.content}</p>
        <img src={post.image} alt="Post" className="post-image" />
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

      {showComments && (
        <div className="comments-section">
          {post.comments.map((comment) => (
            <div key={comment.id} className="comment">
              <img
                src={comment.user.profilePic}
                alt={comment.user.name}
                className="profile-pic"
              />
              <div className="comment-content">
                <h4>{comment.user.name}</h4>
                <p>{comment.content}</p>
                <span className="comment-timestamp">{comment.timestamp}</span>
              </div>
            </div>
          ))}

          <div className="comment-input">
            <input type="text" placeholder="Write a comment..." />
            <button>Post</button>
          </div>
        </div>
      )}
    </article>
  );
}

export default Post;
