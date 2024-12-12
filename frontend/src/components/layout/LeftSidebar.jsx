function LeftSidebar() {
  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <select className="sidebar-select">
          <option value="">Select Category</option>
          <option value="pets">Pets</option>
          <option value="electronics">Electronics</option>
          <option value="jewelry">Jewelry</option>
          <option value="accessories">Accessories</option>
          <option value="clothing">Clothing</option>
          <option value="documents">Documents</option>
          <option value="keys">Keys</option>
          <option value="bags">Bags & Wallets</option>
        </select>
      </div>

      <div className="sidebar-section">
        <h3>Sort By</h3>
        <select className="sidebar-select">
          <option value="">Select Sort Option</option>
          <option value="recent">Date Posted (Newest)</option>
          <option value="oldest">Date Posted (Oldest)</option>
          <option value="mostComments">Most Commented</option>
          <option value="nearMe">Near Me</option>
          <option value="status">Status (Resolved/Unresolved)</option>
        </select>
      </div>

      <div className="sidebar-section quick-filters">
        <h3>Quick Filters</h3>
        <div className="filter-buttons">
          <button className="filter-btn active">All Items</button>
          <button className="filter-btn">Lost Items</button>
          <button className="filter-btn">Found Items</button>
          <button className="filter-btn">Resolved</button>
        </div>
      </div>

      <div className="sidebar-section popular-locations">
        <h3>Popular Locations</h3>
        <ul className="location-list">
          <li>📍 Student Center</li>
          <li>📍 Library</li>
          <li>📍 Gym</li>
          <li>📍 Cafeteria</li>
          <li>📍 Parking Lot</li>
        </ul>
      </div>

      <div className="sidebar-section tips">
        <h3>Quick Tips</h3>
        <div className="tips-container">
          <div className="tip">
            <span className="tip-title">📸 Add Clear Photos</span>
            <p>Include clear images to help identify items</p>
          </div>
          <div className="tip">
            <span className="tip-title">📝 Detailed Description</span>
            <p>Be specific about item characteristics</p>
          </div>
          <div className="tip">
            <span className="tip-title">🗺️ Precise Location</span>
            <p>Mention exact location where item was lost/found</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default LeftSidebar;
