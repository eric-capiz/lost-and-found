import { useState } from "react";

const FilterMenu = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    status: "all",
    itemType: "all",
    sortBy: "newest",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="filter-menu">
      <div className="filter-section">
        <label>
          Status:
          <select name="status" value={filters.status} onChange={handleChange}>
            <option value="all">All</option>
            <option value="resolved">Resolved</option>
            <option value="unresolved">Unresolved</option>
          </select>
        </label>
      </div>

      <div className="filter-section">
        <label>
          Type:
          <select
            name="itemType"
            value={filters.itemType}
            onChange={handleChange}
          >
            <option value="all">All</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </label>
      </div>

      <div className="filter-section">
        <label>
          Sort By:
          <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </label>
      </div>

      <button className="apply-filters" onClick={handleApply}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterMenu;
