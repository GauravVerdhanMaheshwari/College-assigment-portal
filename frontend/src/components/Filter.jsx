import React, { useState, useEffect } from "react";
import { Search } from "./index";

function Filter({ data, entityFields, entityKeys, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(entityKeys[0]); // default first key
  const [sortOrder, setSortOrder] = useState("asc");
  const [groupField, setGroupField] = useState(""); // no grouping initially

  console.log("Filter data:", data);
  

  useEffect(() => {
    let filteredData = [...data];

    // 🔎 Search
    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        entityKeys.some((key) =>
          String(item[key] || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }

    // 🔀 Sort
    filteredData.sort((a, b) => {
      const valA = String(a[sortField] || "").toLowerCase();
      const valB = String(b[sortField] || "").toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // 📂 Group (optional)
    if (groupField) {
      const grouped = {};
      filteredData.forEach((item) => {
        const groupKey = item[groupField] || "Others";
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(item);
      });
      onFilter(grouped, true); // grouped mode
    } else {
      onFilter(filteredData, false); // normal list mode
    }
  }, [searchTerm, sortField, sortOrder, groupField, data]);

  return (
    <div className="flex flex-wrap justify-center gap-4 my-4">
      {/* 🔎 Search */}
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* 🔀 Sort field */}
      <select
        className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
      >
        {entityFields.map((field, idx) => (
          <option key={field} value={entityKeys[idx]}>
            {field}
          </option>
        ))}
      </select>

      {/* ⬆⬇ Sort order */}
      <button
        className="px-4 py-2 rounded-lg bg-[#38BDF8] text-white font-semibold hover:bg-[#0A9FE0FF] shadow-md transition-all"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>

      {/* 📂 Group by */}
      <select
        className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
        value={groupField}
        onChange={(e) => setGroupField(e.target.value)}
      >
        <option value="">No Grouping</option>
        {entityFields.map((field, idx) => (
          <option key={field} value={entityKeys[idx]}>
            Group by {field}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
