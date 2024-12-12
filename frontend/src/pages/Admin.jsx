import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";

function Admin() {
  // We can pass props to control what content shows in the sidebars
  const leftSidebarContent = {
    sections: [
      {
        title: "Statistics",
        items: [
          "Total Posts: 234",
          "Resolved: 156",
          "Unresolved: 78",
          "Total Users: 189",
        ],
      },
      {
        title: "Quick Actions",
        items: ["View All Posts", "View All Users", "View Reports"],
      },
    ],
  };

  const rightSidebarContent = {
    sections: [
      {
        title: "Recent Users",
        items: ["User joined...", "User posted...", "User claimed..."],
      },
    ],
  };

  return (
    <div className="admin-layout">
      <LeftSidebar content={leftSidebarContent} />
      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <div className="admin-posts">
          <h2>All Posts</h2>
          {/* Posts table/grid will go here */}
        </div>
      </main>
      <RightSidebar content={rightSidebarContent} />
    </div>
  );
}

export default Admin;
