import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import DownloadHistory from "./DownloadHistory";

function FacultyPapers({ papers }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [localPapers, setLocalPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  useEffect(() => {
    setLocalPapers(papers || []);
    setFilteredPapers(papers || []);
  }, [papers]);

  /* ===================== GRADE ===================== */
  const handleGrade = async (paperId, grade) => {
    const res = await fetch(`http://localhost:3000/papers/${paperId}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),
    });

    if (res.ok) {
      setLocalPapers((prev) =>
        prev.map((p) => (p._id === paperId ? { ...p, grade } : p))
      );
    }
  };

  /* ===================== ADD COMMENT ===================== */
  const handleAddComment = async (paperId, text, input) => {
    if (!text.trim()) return;

    const res = await fetch(`http://localhost:3000/papers/${paperId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facultyId: user.faculty?._id || user._id,
        text,
      }),
    });

    if (!res.ok) return;

    const newComment = await res.json();

    setLocalPapers((prev) =>
      prev.map((p) =>
        p._id === paperId
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );

    input.value = "";
  };

  /* ===================== EDIT COMMENT ===================== */
  const handleEditComment = async (paperId, commentId, newText) => {
    if (!newText.trim()) return;

    const res = await fetch(
      `http://localhost:3000/papers/${paperId}/comment/${commentId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      }
    );

    if (!res.ok) return;

    setLocalPapers((prev) =>
      prev.map((p) =>
        p._id === paperId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c._id === commentId ? { ...c, text: newText } : c
              ),
            }
          : p
      )
    );
  };

  /* ===================== DELETE COMMENT ===================== */
  const handleDeleteComment = async (paperId, commentId) => {
    await fetch(
      `http://localhost:3000/papers/${paperId}/comment/${commentId}`,
      { method: "DELETE" }
    );

    setLocalPapers((prev) =>
      prev.map((p) =>
        p._id === paperId
          ? {
              ...p,
              comments: p.comments.filter((c) => c._id !== commentId),
            }
          : p
      )
    );
  };

  /* ===================== DOWNLOAD ===================== */
  const handleDownload = (paperId) => {
    window.open(
      `http://localhost:3000/papers/${paperId}/download?role=faculty`,
      "_blank"
    );
  };

  /* ===================== RENDER PAPER ===================== */
  const renderPaper = (paper) => (
    <div key={paper._id} className="p-4 bg-white rounded-xl shadow mb-6">
      <h3 className="text-xl font-semibold">{paper.title}</h3>
      <h4 className="text-lg font-medium">{paper.assignmentTopic}</h4>
      {paper.isLate && (
        <span className="inline-block px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
          ⚠ Submitted Late
        </span>
      )}

      {paper.withinGrace && (
        <span className="inline-block px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded ml-2">
          ⏱ Grace Period
        </span>
      )}

      <DownloadHistory paperId={paper._id} role="faculty" />
      <p>Student: {paper.studentName}</p>
      <p>Enrollment: {paper.enrollment}</p>
      <p>Class: {paper.division}</p>
      <p>Course: {paper.course}</p>
      <p>Semester: {paper.semester}</p>

      {/* 🎓 Grade */}
      <div className="mt-2">
        <label className="font-medium">Grade: </label>
        <input
          type="number"
          defaultValue={paper.grade ?? ""}
          onBlur={(e) => handleGrade(paper._id, e.target.value)}
          className="border p-1 rounded"
          min={0}
          max={100}
          placeholder="0-100"
        />
      </div>

      {/* 💬 Comments */}
      <div className="mt-4">
        <input
          placeholder="Write a comment and press Enter"
          className="w-full border p-2 mb-2 rounded"
          onKeyDown={(e) =>
            e.key === "Enter" &&
            handleAddComment(paper._id, e.target.value, e.target)
          }
        />

        {(paper.comments || []).map((c) => (
          <div key={c._id} className="flex gap-2 items-center mb-1">
            <input
              defaultValue={c.text}
              className="flex-1 border p-1 rounded"
              onBlur={(e) =>
                handleEditComment(paper._id, c._id, e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleEditComment(paper._id, c._id, e.target.value)
              }
            />

            <button
              className="text-red-500"
              onClick={() => handleDeleteComment(paper._id, c._id)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      {/* 📥 Download */}
      <button
        onClick={() => handleDownload(paper._id)}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ⬇ Download Paper
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <Filter
        data={localPapers}
        entityFields={["Title", "Student", "Class", "Course"]}
        entityKeys={["title", "studentName", "division", "course"]}
        onFilter={(res, grouped) => {
          setFilteredPapers(res);
          setIsGrouped(grouped);
        }}
      />

      {filteredPapers.length === 0 && (
        <p className="text-xl text-center text-gray-600 mt-7">
          No papers found.
        </p>
      )}
      {isGrouped
        ? Object.entries(filteredPapers).map(([group, papers]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{group}</h3>
              {papers.map(renderPaper)}
            </div>
          ))
        : filteredPapers.map(renderPaper)}
    </div>
  );
}

export default FacultyPapers;
