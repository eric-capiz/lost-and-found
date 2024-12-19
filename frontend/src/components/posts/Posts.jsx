import { usePosts } from "../../contexts/post/PostContext";
import Post from "./Post";
import { Spinner } from "../common";

function Posts({ view = "all" }) {
  const { posts, loading, error } = usePosts();

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const filteredPosts =
    view === "profile"
      ? posts // Show all posts for profile view
      : posts.filter((post) => post.status === "unresolved"); // Show only unresolved posts for home view

  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            {view === "profile"
              ? "You haven't created any posts yet."
              : "No unresolved posts found."}
          </div>
        ) : (
          filteredPosts.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Posts;
