import React, { useState, useEffect } from "react";
import { Filter } from "../components/index";

function PapersList({ papers, papersAPI, userID, textCSS }) {
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [reportsMap, setReportsMap] = useState({}); // 🔹 paperId -> reports[]

  useEffect(() => {
    setFilteredPapers(papers);
    setIsGrouped(false);
  }, [papers]);

  // 🔹 Delete comment
  const deleteComment = async (paperId, commentId) => {
    try {
      await fetch(
        `http://localhost:3000/papers/${paperId}/comment/${commentId}`,
        { method: "DELETE" },
      );

      setFilteredPapers((prev) => {
        const updatePaper = (p) =>
          p._id !== paperId
            ? p
            : {
                ...p,
                comments: p.comments.filter((c) => c._id !== commentId),
              };

        if (isGrouped && typeof prev === "object" && !Array.isArray(prev)) {
          const newObj = {};
          Object.entries(prev).forEach(([g, items]) => {
            newObj[g] = items.map(updatePaper);
          });
          return newObj;
        }

        return prev.map(updatePaper);
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  // 🔹 Fetch reports for a paper
  const fetchReports = async (paperId) => {
    if (reportsMap[paperId]) return;

    try {
      const res = await fetch(`http://localhost:3000/reports/paper/${paperId}`);
      const data = await res.json();

      setReportsMap((prev) => ({
        ...prev,
        [paperId]: data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete report
  const deleteReport = async (paperId, reportId) => {
    try {
      await fetch(`http://localhost:3000/reports/${reportId}`, {
        method: "DELETE",
      });

      setReportsMap((prev) => ({
        ...prev,
        [paperId]: prev[paperId].filter((r) => r._id !== reportId),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  // 🔹 Action Buttons
  const ActionButtons = ({ paper }) => (
    <a
      href={`http://localhost:3000/papers/${paper._id}/download?${papersAPI}Id=${userID}&role=${papersAPI}&userId=${userID}`}
      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
    >
      Download
    </a>
  );

  // 🔹 Render rows
  const renderRows = (papersArray) =>
    papersArray.map((paper) => (
      <tr key={paper._id} className="hover:bg-gray-100">
        {[
          "title",
          "studentName",
          "class",
          "section",
          "course",
          "submissionDate",
        ].map((key) => (
          <td key={key} className="px-4 py-2 border">
            {paper[key]}
          </td>
        ))}

        {/* 🔹 COMMENTS */}
        <td className="px-4 py-2 border max-w-md">
          <div className="space-y-2">
            {paper.comments?.length ? (
              paper.comments.map((c) => (
                <div
                  key={c._id}
                  className="border rounded p-2 bg-gray-50 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {c.facultyName || "Faculty"}
                    </span>
                    <button
                      className="text-red-500 text-xs"
                      onClick={() =>
                        window.confirm("Delete comment?") &&
                        deleteComment(paper._id, c._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No comments</span>
            )}
          </div>
        </td>

        {/* 🔹 REPORTS SECTION */}
        <td className="px-4 py-2 border max-w-md">
          <button
            onClick={() => fetchReports(paper._id)}
            className="text-blue-500 text-xs mb-2"
          >
            Load Reports
          </button>

          <div className="space-y-2">
            {reportsMap[paper._id]?.length ? (
              reportsMap[paper._id].map((r) => (
                <div
                  key={r._id}
                  className="border rounded p-2 bg-red-50 text-sm"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-red-700">
                      {r.reporterId?.name || "Student"}
                    </span>
                    <button
                      className="text-red-500 text-xs"
                      onClick={() =>
                        window.confirm("Delete report?") &&
                        deleteReport(paper._id, r._id)
                      }
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-gray-800">{r.description}</p>

                  <span className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No reports</span>
            )}
          </div>
        </td>

        {/* 🔹 ACTIONS */}
        <td className="px-4 py-2 border">
          <ActionButtons paper={paper} />
        </td>
      </tr>
    ));

  return (
    <div id="papersList" className="mx-20">
      <h2 className={`text-2xl font-bold text-center mb-5 ${textCSS}`}>
        Submitted Papers
      </h2>

      <Filter
        data={papers}
        entityFields={[
          "Title",
          "Student Name",
          "Submission Date",
          "Class",
          "Section",
          "Course",
        ]}
        entityKeys={[
          "title",
          "studentName",
          "submissionDate",
          "class",
          "section",
          "course",
        ]}
        onFilter={(result, grouped) => {
          setFilteredPapers(result);
          setIsGrouped(grouped);
        }}
      />

      <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-white shadow">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Student</th>
              <th className="px-4 py-2 border">Class</th>
              <th className="px-4 py-2 border">Section</th>
              <th className="px-4 py-2 border">Course</th>
              <th className="px-4 py-2 border">Submitted</th>
              <th className="px-4 py-2 border">Comments</th>
              <th className="px-4 py-2 border">Reports</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>{renderRows(filteredPapers)}</tbody>
        </table>
      </div>
    </div>
  );
}

export default PapersList;
