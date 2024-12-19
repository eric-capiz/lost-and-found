import { createContext, useContext, useState } from "react";

export const FilterContext = createContext();

export const useFilter = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: "",
    sortBy: "recent",
    itemType: "all",
    status: "all",
  });

  const applyFilters = (posts) => {
    if (!posts) return [];

    return posts
      .filter((post) => {
        // Category filter
        if (filters.category && post.category !== filters.category) {
          return false;
        }

        // Item type filter
        if (filters.itemType !== "all" && post.itemType !== filters.itemType) {
          return false;
        }

        // Status filter
        if (filters.status !== "all" && post.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort posts
        switch (filters.sortBy) {
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "mostComments":
            return (b.comments?.length || 0) - (a.comments?.length || 0);
          case "recent":
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <FilterContext.Provider value={{ filters, updateFilters, applyFilters }}>
      {children}
    </FilterContext.Provider>
  );
};
