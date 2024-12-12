function RightSidebar() {
  return (
    <aside className="sidebar sidebar-right">
      <div className="sidebar-section">
        <h3>Recent Activity</h3>
        <ul>
          <li>Item was found...</li>
          <li>New lost item posted...</li>
          <li>Item was claimed...</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Statistics</h3>
        <div className="stats">
          <div>Items Found: 123</div>
          <div>Items Claimed: 89</div>
          <div>Active Posts: 34</div>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
