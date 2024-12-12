import { useState } from "react";
import { FaRegComment } from "react-icons/fa";

function Post({ post }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <article className="post">
      {/* Post Header */}
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
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p>{post.content}</p>
        <img src={post.image} alt="Post" className="post-image" />
      </div>

      {/* Updated Post Footer */}
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

      {/* Comments Section */}
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

          {/* Comment Input */}
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
