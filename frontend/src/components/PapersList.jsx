import React, { useState, useEffect } from "react";
import { Filter } from "../components/index";

function PapersList({ papers, papersAPI, userID, textCSS }) {
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  useEffect(() => {
    setFilteredPapers(papers);
    setIsGrouped(false);
  }, [papers]);

  // 🔹 Delete comment (uses your backend route)
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

  // 🔹 Action Buttons
  const ActionButtons = ({ paper }) => (
    <a
      href={`http://localhost:3000/papers/${paper._id}/download?${papersAPI}Id=${userID}&role=${papersAPI}&userId=${userID}`}
      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
    >
      Download
    </a>
  );

  // 🔹 Render rows (shared by grouped + flat)
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

        {/* 🔹 COMMENTS (INLINE, NO DROPDOWN) */}
        <td className="px-4 py-2 border max-w-md">
          <div className="space-y-2">
            {paper.comments?.length ? (
              paper.comments.map((c) => (
                <div
                  key={c._id}
                  className="border rounded p-2 bg-gray-50 text-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">
                      {c.facultyName || "Faculty"}
                    </span>
                    <button
                      onClick={() => {
                        window.confirm("do you want to delete this comment?") &&
                          deleteComment(paper._id, c._id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="mt-1 text-gray-800">{c.text}</p>

                  <span className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No comments</span>
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

      {/* 🔍 FILTER */}
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

      {/* 📑 TABLE */}
      <div className="max-h-96 overflow-y-auto border rounded-lg p-4 bg-white shadow">
        {isGrouped ? (
          Object.entries(filteredPapers).map(([group, items]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{group}</h3>

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
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>{renderRows(items)}</tbody>
              </table>
            </div>
          ))
        ) : (
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
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredPapers) && renderRows(filteredPapers)}

              {Array.isArray(filteredPapers) && filteredPapers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-4">
                    No papers submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PapersList;
