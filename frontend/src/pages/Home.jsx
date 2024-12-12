import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";

function Home() {
  return (
    <div className="home-layout">
      <LeftSidebar />
      <main className="main-content">
        <h1>Lost & Found</h1>
        {/* Post content will go here */}
      </main>
      <RightSidebar />
    </div>
  );
}

export default Home;
