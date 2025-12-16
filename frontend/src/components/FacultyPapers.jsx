import React, { useEffect, useState } from "react";
import Filter from "./Filter";

function FacultyPapers({ papers }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [localPapers, setLocalPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  useEffect(() => {
    setLocalPapers(papers);
    setFilteredPapers(papers);
  }, [papers]);

  const handleGrade = async (id, grade) => {
    const res = await fetch(`http://localhost:3000/papers/${id}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),
    });

    if (res.ok) {
      setLocalPapers((prev) =>
        prev.map((p) => (p._id === id ? { ...p, grade } : p))
      );
    }
  };

  const handleAddComment = async (paperId, text, input) => {
    if (!text.trim()) return;

    const res = await fetch(`http://localhost:3000/papers/${paperId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facultyId: user.faculty._id,
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

  const renderPaper = (paper) => (
    <div key={paper._id} className="p-4 bg-white rounded-xl shadow mb-6">
      <h3 className="text-xl font-semibold">{paper.title}</h3>
      <p>Student: {paper.studentName}</p>
      <p>Enrollment: {paper.enrollment}</p>
      <p>Class: {paper.division}</p>
      <p>Course: {paper.course}</p>
      <p>Semester: {paper.semester}</p>

      <div className="mt-2">
        <label>Grade: </label>
        <input
          type="number"
          defaultValue={paper.grade ?? ""}
          onBlur={(e) => handleGrade(paper._id, e.target.value)}
          className="border p-1 rounded"
          placeholder="0-100"
          min={0}
          max={100}
        />
      </div>

      <div className="mt-4">
        <input
          placeholder="Write a comment..."
          className="w-full border p-2 mb-2 rounded"
          onKeyDown={(e) =>
            e.key === "Enter" &&
            handleAddComment(paper._id, e.target.value, e.target)
          }
        />

        {(paper.comments || []).map((c) => (
          <div key={c._id} className="flex gap-2 items-center">
            <span className="flex-1">{c.text}</span>
            <button
              className="text-red-500"
              onClick={() => handleDeleteComment(paper._id, c._id)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
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

      {filteredPapers.map(renderPaper)}
    </div>
  );
}

export default FacultyPapers;
