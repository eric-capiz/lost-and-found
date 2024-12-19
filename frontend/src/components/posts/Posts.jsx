import { usePosts } from "../../contexts/post/PostContext";
import { useSearch } from "../../contexts/search/SearchContext";
import Post from "./Post";
import { Spinner } from "../common";

function Posts({ view = "all", posts: userPosts }) {
  const { posts, loading, error } = usePosts();
  const { searchQuery, searchPosts } = useSearch();

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

  // First filter by view type (all/profile)
  const viewFilteredPosts =
    view === "profile"
      ? userPosts
      : posts.filter((post) => post.status === "unresolved");

  // Then apply search filter
  const filteredPosts = searchPosts(viewFilteredPosts, searchQuery);

  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <div className="no-posts">
            {searchQuery
              ? "No posts found matching your search."
              : view === "profile"
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
