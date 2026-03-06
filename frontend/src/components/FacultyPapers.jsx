import React, { useEffect, useState, useCallback } from "react";
import Filter from "./Filter";
import DownloadHistory from "./DownloadHistory";

function FacultyPapers({ papers }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [localPapers, setLocalPapers] = useState([]);
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  // 🔴 Reports state
  const [reportsMap, setReportsMap] = useState({});
  const [loadingReports, setLoadingReports] = useState({});

  useEffect(() => {
    setLocalPapers(papers || []);
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
        prev.map((p) => (p._id === paperId ? { ...p, grade } : p)),
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
          : p,
      ),
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
      },
    );

    if (!res.ok) return;

    setLocalPapers((prev) =>
      prev.map((p) =>
        p._id === paperId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c._id === commentId ? { ...c, text: newText } : c,
              ),
            }
          : p,
      ),
    );
  };

  /* ===================== DELETE COMMENT ===================== */
  const handleDeleteComment = async (paperId, commentId) => {
    await fetch(
      `http://localhost:3000/papers/${paperId}/comment/${commentId}`,
      { method: "DELETE" },
    );

    setLocalPapers((prev) =>
      prev.map((p) =>
        p._id === paperId
          ? {
              ...p,
              comments: p.comments.filter((c) => c._id !== commentId),
            }
          : p,
      ),
    );
  };

  const handleFilter = useCallback((data, grouped) => {
    setFilteredPapers(data);
    setIsGrouped(grouped);
  }, []);

  /* ===================== FETCH REPORTS ===================== */
  const fetchReports = async (paperId) => {
    if (reportsMap[paperId]) return;

    setLoadingReports((p) => ({ ...p, [paperId]: true }));

    try {
      const res = await fetch(`http://localhost:3000/reports/paper/${paperId}`);
      const data = await res.json();

      setReportsMap((prev) => ({
        ...prev,
        [paperId]: data,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports((p) => ({ ...p, [paperId]: false }));
    }
  };

  /* ===================== DELETE GROUP ===================== */
  const handleDeleteGroup = (groupName, groupItems) => {
    if (!window.confirm(`Delete all papers in "${groupName}" group?`)) return;

    const idsToDelete = new Set(groupItems.map((p) => p._id));

    setLocalPapers((prev) => prev.filter((p) => !idsToDelete.has(p._id)));

    // also update filtered view
    setFilteredPapers((prev) => {
      if (!isGrouped) return prev;

      const updated = { ...prev };
      delete updated[groupName];
      return updated;
    });
  };

  /* ===================== DELETE REPORT ===================== */
  const handleDeleteReport = async (paperId, reportId) => {
    if (!window.confirm("Delete this report?")) return;

    await fetch(`http://localhost:3000/reports/${reportId}`, {
      method: "DELETE",
    });

    setReportsMap((prev) => ({
      ...prev,
      [paperId]: prev[paperId].filter((r) => r._id !== reportId),
    }));
  };

  /* ===================== DOWNLOAD ===================== */
  const handleDownload = (paperId) => {
    window.open(
      `http://localhost:3000/papers/${paperId}/download?role=faculty&userId=${
        user.faculty?._id || user._id
      }`,
      "_blank",
    );
  };

  /*================= PAPER FILTER ==============*/

  const handlePaperFilter = React.useCallback((res, grouped) => {
    setFilteredPapers(res);
    setIsGrouped(grouped);
  }, []);

  const isEmpty = isGrouped
    ? Object.keys(filteredPapers || {}).length === 0
    : (filteredPapers || []).length === 0;

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

      <DownloadHistory submissionId={paper.downloads} />

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

      {/* 🚩 REPORTS */}
      <div className="mt-4 border-t pt-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-red-600">🚩 Reports</h4>
          <button
            onClick={() => fetchReports(paper._id)}
            className="text-sm text-blue-500 hover:underline"
          >
            View Reports
          </button>
        </div>

        {loadingReports[paper._id] && (
          <p className="text-sm text-gray-500 mt-1">Loading reports...</p>
        )}

        {reportsMap[paper._id]?.length === 0 && (
          <p className="text-sm text-gray-500 mt-1">
            No reports for this paper.
          </p>
        )}

        {(reportsMap[paper._id] || []).map((r) => (
          <div
            key={r._id}
            className="mt-2 p-3 bg-red-50 border border-red-200 rounded"
          >
            <div className="flex justify-between">
              <span className="font-medium text-red-700">
                {r.reporterId?.name || "Student"}
              </span>
              <button
                onClick={() => handleDeleteReport(paper._id, r._id)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>

            <p className="text-sm mt-1">{r.description}</p>
            <span className="text-xs text-gray-500">
              {new Date(r.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* 📥 Download */}
      <button
        onClick={() => handleDownload(paper._id)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        ⬇ Download Paper
      </button>
    </div>
  );

  return (
    <div className="p-6">
      <Filter
        data={localPapers ?? []}
        entityFields={["Title", "Student", "Class", "Course"]}
        entityKeys={["title", "studentName", "division", "course"]}
        groupableKeys={["division", "course"]}
        onFilter={handleFilter}
        onDeleteGroup={handleDeleteGroup}
      />

      {isEmpty && (
        <p className="text-xl text-center text-gray-600 mt-7">
          No papers found.
        </p>
      )}

      {isGrouped
        ? Object.entries(filteredPapers).map(([group, papers]) => (
            <div key={group} className="mb-8">
              {/* ✅ GROUP HEADER WITH DELETE */}
              <div className="flex justify-between items-center mb-2 bg-gray-100 px-3 py-2 rounded">
                <h3 className="text-lg font-bold">
                  {group} ({papers.length})
                </h3>

                <button
                  onClick={() => handleDeleteGroup(group, papers)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                >
                  Delete Group
                </button>
              </div>

              {papers.map(renderPaper)}
            </div>
          ))
        : filteredPapers.map(renderPaper)}
    </div>
  );
}

export default FacultyPapers;
