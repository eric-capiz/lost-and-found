import { useEffect, useMemo } from "react";
import { usePosts } from "../../contexts/post/PostContext";
import { useSearch } from "../../contexts/search/SearchContext";
import { useFilter } from "../../contexts/filter/FilterContext";
import Post from "./Post";
import { Spinner } from "../common";
import { useLocation, useNavigate } from "react-router-dom";

function Posts({
  view = "all",
  posts: userPosts,
  layout = "list",
}) {
  const { posts, loading, error } = usePosts();
  const { searchQuery, searchPosts } = useSearch();
  const { applyFilters } = useFilter();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollToPostId && !loading) {
      setTimeout(() => {
        const postElement = document.getElementById(
          location.state.scrollToPostId
        );

        if (postElement) {
          postElement.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
        }

        navigate(location.pathname, { replace: true });
      }, 500);
    }
  }, [
    location.state?.scrollToPostId,
    loading,
    posts,
    navigate,
    location.pathname,
  ]);

  // Memoize all filtering operations
  const finalFilteredPosts = useMemo(() => {
    if (loading || error) return [];

    // First filter by view type (all/profile)
    const viewFilteredPosts =
      view === "profile"
        ? userPosts
        : location.state?.includeResolved
        ? posts // If includeResolved is true, show all posts
        : posts.filter((post) => post.status === "unresolved");

    // Then apply search filter
    const searchFilteredPosts = searchPosts(viewFilteredPosts, searchQuery);

    // Finally apply sidebar filters
    return applyFilters(searchFilteredPosts);
  }, [
    view,
    userPosts,
    posts,
    location.state?.includeResolved,
    searchQuery,
    searchPosts,
    applyFilters,
    loading,
    error,
  ]);

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

  const tilesMode = layout === "tiles";
  const profileGrid = layout === "profileGrid";

  return (
    <div
      className={`posts-wrapper${
        tilesMode ? " posts-wrapper--tiles" : " posts-wrapper--feed"
      }${profileGrid ? " posts-wrapper--profile-grid" : ""}`}
    >
      <div
        className={`posts-container${
          tilesMode ? " posts-container--tiles" : ""
        }${profileGrid ? " posts-container--profile-grid" : ""}`}
      >
        {finalFilteredPosts.length === 0 ? (
          <div className="no-posts">
            {searchQuery
              ? "No posts found matching your search."
              : view === "profile"
              ? "You haven't created any posts yet."
              : "No posts found matching your filters."}
          </div>
        ) : (
          finalFilteredPosts.map((post) => {
            return (
              <div id={post._id} key={post._id}>
                <Post
                  post={post}
                  openComments={post._id === location.state?.scrollToPostId}
                  highlightCommentId={location.state?.highlightCommentId}
                  profileCompact={profileGrid && view === "profile"}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Posts;
