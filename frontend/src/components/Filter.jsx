import React, { useState, useEffect, useMemo } from "react";
import { Search } from "./index";

function Filter({
  data = [],
  entityFields = [],
  entityKeys = [],
  groupableKeys = [],
  onFilter,
  onDeleteGroup, // ✅ NEW
  API_URL = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortField, setSortField] = useState(entityKeys[0] || "");
  const [sortOrder, setSortOrder] = useState("asc");
  const [groupField, setGroupField] = useState("");

  // ✅ debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ PURE processing
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) {
      return { grouped: false, data: [] };
    }

    let filteredData = [...data];

    // 🔎 Search
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();

      filteredData = filteredData.filter((item) =>
        entityKeys.some((key) =>
          String(item?.[key] ?? "")
            .toLowerCase()
            .includes(term),
        ),
      );
    }

    // 🔀 Sort
    if (sortField) {
      filteredData.sort((a, b) => {
        const valA = String(a?.[sortField] ?? "").toLowerCase();
        const valB = String(b?.[sortField] ?? "").toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    // 📂 Group
    if (groupField) {
      const grouped = filteredData.reduce((acc, item) => {
        const key = item?.[groupField] || "Others";
        (acc[key] ||= []).push(item);
        return acc;
      }, {});

      return { grouped: true, data: grouped };
    }

    return { grouped: false, data: filteredData };
  }, [data, debouncedSearch, sortField, sortOrder, groupField, entityKeys]);

  // ✅ notify parent
  useEffect(() => {
    onFilter?.(processedData.data, processedData.grouped, groupField);
  }, [processedData, onFilter, groupField]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mx-6 lg:mx-20 mb-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex flex-wrap gap-3">
          {/* 🔀 Sort field */}
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-400"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            {entityFields.map((field, idx) => (
              <option key={field} value={entityKeys[idx]}>
                Sort by {field}
              </option>
            ))}
          </select>

          {/* 🔀 Sort order */}
          <button
            className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 shadow-sm transition"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>

          {/* 📂 Group */}
          <select
            className="px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-400"
            value={groupField}
            onChange={(e) => setGroupField(e.target.value)}
          >
            <option value="">No Grouping</option>
            {entityKeys.map((key, idx) =>
              groupableKeys.includes(key) ? (
                <option key={key} value={key}>
                  Group by {entityFields[idx]}
                </option>
              ) : null,
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Filter;
