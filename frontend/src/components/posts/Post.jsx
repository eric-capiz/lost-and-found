import { useState, useContext } from "react";
import { FaRegComment, FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../contexts/auth/AuthContext";
import { usePosts } from "../../contexts/post/PostContext";
import { format } from "date-fns";
import ImageModal from "../modals/ImageModal";
import ConfirmModal from "../modals/ConfirmModal";
import defaultAvatar from "../../assets/images/avatar.png";
import EditPost from "../modals/EditPost";

function Post({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useContext(AuthContext);
  const { deletePost } = usePosts();

  const isOwner = user?._id === post.userId._id;

  const handleDelete = () => {
    deletePost(post._id);
    setShowDeleteModal(false);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    return (
      <div className="post-images">
        {post.images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`Post ${index + 1}`}
            className="post-image"
            onClick={() => handleImageClick(image.url)}
          />
        ))}
      </div>
    );
  };

  return (
    <article className="post">
      <div className="post-header">
        <div className="user-info">
          <img
            src={post?.userId?.profilePic?.url || defaultAvatar}
            alt={post.userId.username}
            className="profile-pic"
          />
          <div className="user-details">
            <h3>{post?.userId?.username?.toUpperCase()}</h3>
            <div className="post-meta">
              <div className="meta-row">
                <span className="date">
                  {format(new Date(post.createdAt), "MM/dd/yyyy")}
                </span>
                <span className="location">
                  {post.city}, {post.state}
                </span>
              </div>
              <div className="meta-row">
                <span className="status">{post.status.toUpperCase()}</span>
                <span className="category">{post.category.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="post-actions">
            <button
              className="icon-button"
              onClick={() => setShowEditModal(true)}
            >
              <FaEdit className="edit-icon" />
            </button>
            <button
              className="icon-button"
              onClick={() => setShowDeleteModal(true)}
            >
              <FaTrash className="delete-icon" />
            </button>
          </div>
        )}
      </div>

      <div className="post-content">
        <h2>
          {post.itemType.toUpperCase()}: {post.title}
        </h2>
        <p>{post.description}</p>
        {renderImages()}
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            <span className="tags-label">Tags:</span>
            <div className="tags-container">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag-pill">
                  #{tag.toUpperCase()}
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

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <img
                    src={comment.userId?.profilePic?.url || defaultAvatar}
                    alt={comment.userId?.username}
                    className="comment-profile-pic"
                  />
                  <div className="comment-user-info">
                    <h4>{comment.userId?.username}</h4>
                    <span className="comment-timestamp">
                      {format(new Date(comment.createdAt), "MM/dd/yyyy")}
                    </span>
                  </div>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">
              No comments yet. Be the first to comment!
            </p>
          )}

          {/* Comment Input - we'll add functionality later */}
          <div className="comment-input">
            <input type="text" placeholder="Write a comment..." disabled />
            <button disabled>Post</button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Post"
        message={`Are you sure you wish to delete post: ${post.title}?`}
      />

      <EditPost
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        post={post}
      />
    </article>
  );
}

export default Post;
