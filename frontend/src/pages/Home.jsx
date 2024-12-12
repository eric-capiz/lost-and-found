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
        <LeftSidebar />
        <main className="main-content">
          <Posts />
        </main>
        <RightSidebar />
      </div>
    </>
  );
}

export default Home;
