import { usePosts } from "../../contexts/post/PostContext";
import { useSearch } from "../../contexts/search/SearchContext";
import { useFilter } from "../../contexts/filter/FilterContext";
import Post from "./Post";
import { Spinner } from "../common";

function Posts({ view = "all", posts: userPosts }) {
  const { posts, loading, error } = usePosts();
  const { searchQuery, searchPosts } = useSearch();
  const { applyFilters } = useFilter();

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
  const searchFilteredPosts = searchPosts(viewFilteredPosts, searchQuery);

  // Finally apply sidebar filters
  const finalFilteredPosts = applyFilters(searchFilteredPosts);

  return (
    <div className="posts-wrapper">
      <div className="posts-container">
        {finalFilteredPosts.length === 0 ? (
          <div className="no-posts">
            {searchQuery
              ? "No posts found matching your search."
              : view === "profile"
              ? "You haven't created any posts yet."
              : "No posts found matching your filters."}
          </div>
        ) : (
          finalFilteredPosts.map((post) => <Post key={post._id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default Posts;
