import React, { useEffect, useState } from "react";
import Filter from "./Filter";

function FacultyPapers({ papers, textCSS, buttonCSS }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [localPapers, setLocalPapers] = useState([]);

  console.log(papers);

  useEffect(() => {
    setFilteredPapers(papers);
    setLocalPapers(papers);
  }, [papers]);

  const handleGrade = async (id, value) => {
    const res = await fetch(`http://localhost:3000/papers/${id}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade: value }),
    });

    if (res.ok) {
      setLocalPapers((prev) =>
        prev.map((p) => (p.id === id ? { ...p, grade: value } : p))
      );
    }
  };

  const handleComment = async (id, text) => {
    if (!text) return;

    const res = await fetch(`http://localhost:3000/papers/${id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facultyId: user.faculty._id,
        text,
      }),
    });

    if (res.ok) {
      setLocalPapers((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, comments: [...(p.comments || []), text] } : p
        )
      );
    }
  };

  const handleDownload = (paper) => {
    window.open(`http://localhost:3000/papers/${paper.id}/download`, "_blank");
  };

  const entityFields = [
    "Title",
    "Student",
    "Class",
    "Course",
    "Enrollment",
    "Semester",
  ];

  const entityKeys = [
    "title",
    "studentName",
    "division",
    "course",
    "enrollment",
    "semester",
  ];

  const renderPaper = (paper) => (
    <div
      key={paper.id}
      className="mb-6 p-4 bg-white rounded-xl shadow-md transition hover:shadow-lg"
    >
      <h3 className="text-xl font-semibold">{paper.title}</h3>

      <p className="text-sm text-gray-600">Student: {paper.studentName}</p>
      <p className="text-sm text-gray-600">Enrollment: {paper.enrollment}</p>

      <p>
        <b>Class:</b> {paper.division}
      </p>
      <p>
        <b>Course:</b> {paper.course}
      </p>
      <p>
        <b>Semester:</b> {paper.semester}
      </p>

      {/* 🎓 Grade */}
      <div className="mt-2">
        <label className="font-medium">Grade: </label>
        <input
          type="number"
          min="0"
          max="100"
          className="border p-1 rounded"
          defaultValue={paper.grade ?? ""}
          onBlur={(e) => handleGrade(paper.id, e.target.value)}
        />
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
          {(paper.comments || []).map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <input
                type="text"
                defaultValue={c.text}
                className="border p-1 rounded w-full"
                onBlur={(e) =>
                  fetch(
                    `http://localhost:3000/papers/${paper.id}/comment/${c.id}`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ text: e.target.value }),
                    }
                  )
                }
              />
              <button
                className="text-red-500 text-sm"
                onClick={() =>
                  fetch(
                    `http://localhost:3000/papers/${paper.id}/comment/${c.id}`,
                    { method: "DELETE" }
                  ).then(() =>
                    setLocalPapers((prev) =>
                      prev.map((p) =>
                        p.id === paper.id
                          ? {
                              ...p,
                              comments: p.comments.filter((x) => x.id !== c.id),
                            }
                          : p
                      )
                    )
                  )
                }
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 📌 Buttons */}
      <div className="flex gap-3 mt-3">
        <button className={`px-4 py-2 rounded ${buttonCSS}`}>🚩 Report</button>
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

      <Filter
        data={localPapers}
        entityFields={entityFields}
        entityKeys={entityKeys}
        onFilter={(result, grouped) => {
          setFilteredPapers(result);
          setIsGrouped(grouped);
        }}
      />

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
