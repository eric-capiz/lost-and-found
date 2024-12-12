function LeftSidebar() {
  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul>
          <li>Lost Items</li>
          <li>Found Items</li>
          <li>Claimed Items</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Filter By</h3>
        <ul>
          <li>Date Posted</li>
          <li>Location</li>
          <li>Item Type</li>
        </ul>
      </div>
    </aside>
  );
}

export default LeftSidebar;
