import React, { useState, useContext, useMemo } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { FaUserEdit, FaFilter, FaPlus } from "react-icons/fa";
import Posts from "../components/posts/Posts";
import PostItem from "../components/modals/PostItem";
import EditProfile from "../components/modals/EditProfile";
import { UserContext } from "../contexts/user/UserContext";
import { AuthContext } from "../contexts/auth/AuthContext";
import { usePosts } from "../contexts/post/PostContext";
import { Spinner } from "../components/common";
import defaultAvatar from "../assets/images/avatar.png";
import defaultCover from "../assets/images/maze.jpg";
import FilterMenu from "../components/filter/FilterMenu";
import {
  format,
  subDays,
  isAfter,
  formatDistanceToNow,
} from "date-fns";

function Profile() {
  const location = useLocation();
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const { loading: userLoading } = useContext(UserContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const { posts, loading: postsLoading } = usePosts();
  const [isFilterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    itemType: "all",
    sortBy: "newest",
  });

  const userPosts = posts.filter((post) => post.userId._id === user?._id);
  const resolvedPosts = userPosts.filter((post) => post.status === "resolved");
  const unresolvedPosts = userPosts.filter(
    (post) => post.status === "unresolved"
  );

  const {
    resolutionRate,
    postsThisWeek,
    memberSinceLabel,
    lostCount,
    foundCount,
    totalCommentsReceived,
    lastActivityLabel,
    recentPostLinks,
    categoryChips,
  } = useMemo(() => {
    const total = userPosts.length;
    const resolved = resolvedPosts.length;
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    const weekAgo = subDays(new Date(), 7);
    const recent = userPosts.filter((p) =>
      isAfter(new Date(p.createdAt), weekAgo)
    ).length;

    let since = null;
    if (user?.createdAt) {
      since = format(new Date(user.createdAt), "MMMM yyyy");
    } else if (userPosts.length > 0) {
      const earliest = new Date(
        Math.min(...userPosts.map((p) => new Date(p.createdAt).getTime()))
      );
      since = format(earliest, "MMMM yyyy");
    }

    const lost = userPosts.filter((p) => p.itemType === "lost").length;
    const found = userPosts.filter((p) => p.itemType === "found").length;

    const commentsSum = userPosts.reduce(
      (acc, p) => acc + (typeof p.commentCount === "number" ? p.commentCount : 0),
      0
    );

    let lastLabel = null;
    if (userPosts.length > 0) {
      const newest = userPosts.reduce((best, p) =>
        new Date(p.createdAt) > new Date(best.createdAt) ? p : best
      );
      lastLabel = formatDistanceToNow(new Date(newest.createdAt), {
        addSuffix: true,
      });
    }

    const sorted = [...userPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const links = sorted.slice(0, 8).map((p) => ({
      id: p._id,
      title: p.title,
      itemType: p.itemType,
      createdAt: p.createdAt,
    }));

    const catMap = userPosts.reduce((acc, p) => {
      const key = (p.category || "General").trim();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const chips = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      resolutionRate: rate,
      postsThisWeek: recent,
      memberSinceLabel: since,
      lostCount: lost,
      foundCount: found,
      totalCommentsReceived: commentsSum,
      lastActivityLabel: lastLabel,
      recentPostLinks: links,
      categoryChips: chips,
    };
  }, [userPosts, resolvedPosts.length, user?.createdAt]);

  const lostFoundTotal = lostCount + foundCount;
  const lostPct =
    lostFoundTotal > 0
      ? Math.round((lostCount / lostFoundTotal) * 100)
      : 0;

  const openPostModal = () => setPostModalOpen(true);
  const closePostModal = () => setPostModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleApplyFilters = (filters) => {
    let filtered = [...userPosts];

    if (filters.status !== "all") {
      filtered = filtered.filter((post) => post.status === filters.status);
    }

    if (filters.itemType !== "all") {
      filtered = filtered.filter((post) => post.itemType === filters.itemType);
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setFilteredPosts(filtered);
    setActiveFilters(filters);
    setFilterMenuOpen(false);
  };

  const locationLabel =
    user?.city && user?.state
      ? `${user.city}, ${user.state}`
      : "Not set — add city & state in Edit profile";

  if (authLoading || userLoading || postsLoading) {
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="profile-page">
      <header className="profile-hero">
        <div className="profile-hero__cover">
          <img
            src={user?.coverPic?.url || defaultCover}
            alt=""
            className="profile-hero__cover-img"
          />
          <div className="profile-hero__scrim" aria-hidden="true" />
        </div>

        <div className="profile-hero__body">
          <div className="profile-hero__main">
            <img
              src={user?.profilePic?.url || defaultAvatar}
              alt=""
              className="profile-hero__avatar"
              width={112}
              height={112}
            />

            <div className="profile-hero__identity">
              <h1 className="profile-hero__name">
                {user?.username?.toUpperCase()}
              </h1>
              <div className="profile-hero__meta">
                <span className="profile-hero__location">{locationLabel}</span>
                <span className="profile-hero__dot" aria-hidden="true">
                  ·
                </span>
                <span className="profile-hero__email">{user?.email}</span>
              </div>
            </div>

            <div className="profile-hero__actions">
              <button
                type="button"
                className="profile-btn profile-btn--secondary"
                onClick={openEditModal}
              >
                <FaUserEdit aria-hidden /> Edit profile
              </button>
              <button
                type="button"
                className="profile-btn profile-btn--primary"
                onClick={openPostModal}
              >
                <FaPlus aria-hidden /> New post
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="profile-dashboard">
        <aside className="profile-rail profile-rail--left" aria-label="Summary">
          <section className="profile-panel profile-panel--ledger">
            <p className="profile-panel__eyebrow">Summary</p>
            <div className="ledger-grid">
              <div className="ledger-cell">
                <span className="ledger-cell__value">{userPosts.length}</span>
                <span className="ledger-cell__label">Posts</span>
              </div>
              <div className="ledger-cell">
                <span className="ledger-cell__value">
                  {unresolvedPosts.length}
                </span>
                <span className="ledger-cell__label">Open</span>
              </div>
              <div className="ledger-cell">
                <span className="ledger-cell__value">
                  {resolvedPosts.length}
                </span>
                <span className="ledger-cell__label">Resolved</span>
              </div>
            </div>

            <div className="ledger-meter">
              <div className="ledger-meter__track" aria-hidden="true">
                <div
                  className="ledger-meter__fill"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
              <span className="ledger-meter__caption">
                {resolutionRate}% of your posts marked resolved
              </span>
            </div>

            <dl className="ledger-facts">
              <div className="ledger-facts__row">
                <dt>Listed location</dt>
                <dd>{locationLabel}</dd>
              </div>
              <div className="ledger-facts__row">
                <dt>Contact email</dt>
                <dd>{user?.email || "—"}</dd>
              </div>
              {memberSinceLabel && (
                <div className="ledger-facts__row">
                  <dt>Member since</dt>
                  <dd>{memberSinceLabel}</dd>
                </div>
              )}
              {lastActivityLabel && (
                <div className="ledger-facts__row">
                  <dt>Latest post</dt>
                  <dd>{lastActivityLabel}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="profile-panel profile-panel--split">
            <p className="profile-panel__eyebrow">Lost &amp; found</p>
            {lostFoundTotal === 0 ? (
              <p className="split-bars__empty">
                Your lost vs found mix will show here once you publish posts.
              </p>
            ) : (
              <div className="split-bars">
                <div className="split-bars__labels">
                  <span>Lost {lostCount}</span>
                  <span>Found {foundCount}</span>
                </div>
                <div
                  className="split-bars__track"
                  role="img"
                  aria-label={`${lostCount} lost posts and ${foundCount} found posts`}
                >
                  <span
                    className="split-bars__lost"
                    style={{ width: `${lostPct}%` }}
                  />
                  <span
                    className="split-bars__found"
                    style={{ width: `${100 - lostPct}%` }}
                  />
                </div>
                <p className="split-bars__hint">
                  Share of <em>your</em> listings — not the whole campus feed.
                </p>
              </div>
            )}
          </section>

          <section className="profile-panel profile-panel--engagement">
            <p className="profile-panel__eyebrow">Engagement</p>
            <p className="engagement-stat">
              <span className="engagement-stat__n">{totalCommentsReceived}</span>
              <span className="engagement-stat__txt">
                comments across your posts
              </span>
            </p>
            <p className="engagement-sub">
              Every reply helps someone narrow the search.
            </p>
          </section>
        </aside>

        <div className="profile-main">
          <section
            className="posts-section"
            aria-labelledby="profile-posts-heading"
          >
            <div className="posts-section__head">
              <div className="posts-section__intro">
                <h2 className="posts-section__title" id="profile-posts-heading">
                  Your listings
                </h2>
                <p className="posts-section__lede">
                  Two-column grid on desktop — tap a card to jump into comments.
                </p>
              </div>
              <div className="posts-controls">
                <div className="filter-container">
                  <button
                    type="button"
                    className="filter-button"
                    onClick={() => setFilterMenuOpen(!isFilterMenuOpen)}
                    aria-expanded={isFilterMenuOpen}
                  >
                    <FaFilter aria-hidden /> Filters
                  </button>
                  {isFilterMenuOpen && (
                    <FilterMenu
                      onApplyFilters={handleApplyFilters}
                      initialFilters={activeFilters}
                    />
                  )}
                </div>
              </div>
            </div>

            {filteredPosts.length > 0 ||
            activeFilters.status !== "all" ||
            activeFilters.itemType !== "all" ? (
              <Posts
                posts={filteredPosts}
                view="profile"
                layout="profileGrid"
              />
            ) : userPosts.length > 0 ? (
              <Posts posts={userPosts} view="profile" layout="profileGrid" />
            ) : (
              <p className="posts-section__empty">
                Nothing here yet — create a post to show up in the grid.
              </p>
            )}
          </section>
        </div>

        <aside
          className="profile-rail profile-rail--right"
          aria-label="Tips and activity"
        >
          <section className="profile-panel profile-panel--pulse">
            <p className="profile-panel__eyebrow">Last 7 days</p>
            <p className="pulse-copy">
              <span className="pulse-copy__n">{postsThisWeek}</span>
              <span className="pulse-copy__txt">
                {postsThisWeek === 1 ? " new post" : " new posts"}
              </span>
            </p>
          </section>

          {recentPostLinks.length > 0 && (
            <section className="profile-panel profile-panel--recent">
              <p className="profile-panel__eyebrow">Jump to a post</p>
              <ul className="recent-posts-list">
                {recentPostLinks.map((p) => (
                  <li key={p.id}>
                    <a href={`#${p.id}`} className="recent-posts-list__link">
                      <span
                        className={`recent-posts-list__pill recent-posts-list__pill--${p.itemType}`}
                      >
                        {p.itemType}
                      </span>
                      <span className="recent-posts-list__title">
                        {p.title.length > 42
                          ? `${p.title.slice(0, 40)}…`
                          : p.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {categoryChips.length > 0 && (
            <section className="profile-panel profile-panel--tags">
              <p className="profile-panel__eyebrow">Categories you use</p>
              <div className="category-chip-row">
                {categoryChips.map(([label, count]) => (
                  <span key={label} className="category-chip">
                    {label}{" "}
                    <span className="category-chip__n">{count}</span>
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="profile-panel profile-panel--notes">
            <p className="profile-panel__eyebrow">Posting checklist</p>
            <ul className="field-notes">
              <li>
                <strong>Title:</strong> item + color + where last seen.
              </li>
              <li>
                <strong>Photo:</strong> one clear shot beats five blurry ones.
              </li>
              <li>
                <strong>Place:</strong> building name or landmark, not just
                “campus.”
              </li>
              <li>
                <strong>Close the loop:</strong> mark resolved when it&apos;s
                home.
              </li>
            </ul>
          </section>

          <Link to="/" className="profile-panel profile-panel--cta">
            <span className="profile-panel__eyebrow">Browse everyone</span>
            <span className="cta-line">Open the full registry →</span>
          </Link>
        </aside>
      </div>

      <PostItem isOpen={isPostModalOpen} onClose={closePostModal} />
      <EditProfile isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );
}

export default Profile;
