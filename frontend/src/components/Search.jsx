import React from "react";

function Search({ searchTerm, setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search..."
      className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

export default Search;
