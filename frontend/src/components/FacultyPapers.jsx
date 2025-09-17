import React, { useState } from "react";
import Filter from "./Filter";

function FacultyPapers({ papers, textCSS, buttonCSS }) {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [filteredPapers, setFilteredPapers] = useState(papers);
  const [isGrouped, setIsGrouped] = useState(false);

  const handleRate = (id, value) => {
    setRatings({ ...ratings, [id]: value });
  };

  const handleComment = (id, comment) => {
    if (!comment) return;
    setComments({
      ...comments,
      [id]: [...(comments[id] || []), comment],
    });
  };

  const handleDownload = (paper) => {
    alert(`Downloading paper: ${paper.title}`);
    // Placeholder -> actual file download logic later
  };

  const handleReport = (paper) => {
    alert(`Reported paper: ${paper.title}`);
  };

  const entityFields = ["Title", "Author", "Class", "Course", "Year"];
  const entityKeys = ["title", "author", "division", "course", "year"];

  const renderPaper = (paper) => (
    <div
      key={paper.id}
      className="mb-6 p-4 bg-white rounded-xl shadow-md transition hover:shadow-lg"
    >
      <h3 className="text-xl font-semibold">{paper.title}</h3>
      <p className="text-sm text-gray-600">By {paper.author}</p>
      <p>
        <b>Class:</b> {paper.division}
      </p>
      <p>
        <b>Course:</b> {paper.course}
      </p>
      <p>
        <b>Year:</b> {paper.year}
      </p>

      {/* ⭐ Ratings */}
      <div className="mt-2">
        <label className="font-medium">Rate: </label>
        <select
          className="border rounded p-1"
          value={ratings[paper.id] || paper.rating || ""}
          onChange={(e) => handleRate(paper.id, e.target.value)}
        >
          <option value="">Select</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>
      </div>

      {/* 💬 Comments */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Write a comment..."
          className="w-full border p-2 rounded mb-2"
          onKeyDown={(e) =>
            e.key === "Enter" && handleComment(paper.id, e.target.value)
          }
        />
        <div className="space-y-1">
          {(comments[paper.id] || paper.comments || []).map((c, idx) => (
            <p key={idx} className="text-sm text-gray-700">
              • {c}
            </p>
          ))}
        </div>
      </div>

      {/* 📌 Action Buttons */}
      <div className="flex gap-3 mt-3">
        <button
          className={`px-4 py-2 rounded ${buttonCSS}`}
          onClick={() => handleReport(paper)}
        >
          🚩 Report
        </button>
        <button
          className={`px-4 py-2 rounded ${buttonCSS}`}
          onClick={() => handleDownload(paper)}
        >
          ⬇ Download
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white/40 rounded-2xl shadow-lg">
      <h2 className={`text-2xl font-bold mb-4 ${textCSS}`}>Papers</h2>

      {/* 🔎 Filter + Search */}
      <Filter
        data={papers}
        entityFields={entityFields}
        entityKeys={entityKeys}
        onFilter={(result, grouped) => {
          setFilteredPapers(result);
          setIsGrouped(grouped);
        }}
      />

      {/* 📄 Render Papers */}
      {isGrouped
        ? Object.entries(filteredPapers).map(([group, groupItems]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{group}</h3>
              {groupItems.map(renderPaper)}
            </div>
          ))
        : filteredPapers.map(renderPaper)}
    </div>
  );
}

export default FacultyPapers;
