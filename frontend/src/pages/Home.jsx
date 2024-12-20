import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import Posts from "../components/posts/Posts";

function Home() {
  return (
    <>
      <div className="hero-section">
        <h1>Lost & Found</h1>
      </div>
      <div className="home-layout">
        {/* <div className="mobile-category-filter">
          <select defaultValue="" className="category-select">
            <option value="" disabled>
              Filter by Category
            </option>
            <option value="all">All Items</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>
        </div> */}

        <LeftSidebar />
        <Posts view="home" />
        <RightSidebar />
      </div>
    </>
  );
}

export default Home;
