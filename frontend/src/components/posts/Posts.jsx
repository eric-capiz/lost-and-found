import { useEffect } from "react";
import { usePosts } from "../../contexts/post/PostContext";
import { useSearch } from "../../contexts/search/SearchContext";
import { useFilter } from "../../contexts/filter/FilterContext";
import Post from "./Post";
import { Spinner } from "../common";
import { useLocation, useNavigate } from "react-router-dom";

function Posts({ view = "all", posts: userPosts }) {
  const { posts, loading, error } = usePosts();
  const { searchQuery, searchPosts } = useSearch();
  const { applyFilters } = useFilter();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollToPostId && !loading) {
      console.log("Scroll effect triggered");
      console.log("Loading state:", loading);
      console.log("Target post ID:", location.state.scrollToPostId);

      setTimeout(() => {
        const postElement = document.getElementById(
          location.state.scrollToPostId
        );
        console.log("Found post element:", postElement);

        if (postElement) {
          console.log("Scrolling to post...");
          postElement.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          console.log("Post element not found in DOM");
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
      : location.state?.includeResolved
      ? posts // If includeResolved is true, show all posts
      : posts.filter((post) => post.status === "unresolved");

  // Then apply search filter
  const searchFilteredPosts = searchPosts(viewFilteredPosts, searchQuery);

  // Finally apply sidebar filters
  const finalFilteredPosts = applyFilters(searchFilteredPosts);

  console.log(
    "Final filtered posts:",
    finalFilteredPosts.map((p) => p._id)
  );
  console.log("Looking for post:", location.state?.scrollToPostId);

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
          finalFilteredPosts.map((post) => {
            console.log("Rendering post:", post._id);
            return (
              <div id={post._id} key={post._id}>
                <Post
                  post={post}
                  openComments={post._id === location.state?.scrollToPostId}
                  highlightCommentId={location.state?.highlightCommentId}
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
