import React, { useState, useEffect } from "react";
import { Filter } from "../components/index";

function PapersList({ papers, textCSS, buttonCSS, handleDelete, handleEdit }) {
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);

  useEffect(() => {
    setFilteredPapers(papers);
    setIsGrouped(false);
  }, [papers]);

  // helper to remove ids from local state
  const removePapersFromState = (deletedIds) => {
    setFilteredPapers((prev) => {
      if (
        isGrouped &&
        prev &&
        typeof prev === "object" &&
        !Array.isArray(prev)
      ) {
        const newObj = {};
        Object.entries(prev).forEach(([grp, items]) => {
          const remaining = items.filter((p) => !deletedIds.includes(p._id));
          if (remaining.length > 0) newObj[grp] = remaining;
        });
        return newObj;
      }
      if (Array.isArray(prev)) {
        return prev.filter((p) => !deletedIds.includes(p._id));
      }
      return prev;
    });
  };

  // single delete
  const handleSingleDelete = async (paper) => {
    const ok = window.confirm(
      `Delete paper "${paper.title}"? This cannot be undone.`
    );
    if (!ok) return;

    if (!handleDelete) {
      removePapersFromState([paper._id]);
      return;
    }

    try {
      await handleDelete(paper);
      removePapersFromState([paper._id]);
    } catch (err) {
      console.error(err);
      alert("Error deleting paper. See console for details.");
    }
  };

  // group delete
  const handleDeleteGroup = async (items, groupName) => {
    const ok = window.confirm(
      `Delete ${items.length} paper(s) in group "${groupName}"?`
    );
    if (!ok) return;

    const ids = items.map((p) => p._id);

    if (!handleDelete) {
      removePapersFromState(ids);
      return;
    }

    try {
      await Promise.all(items.map((p) => handleDelete(p)));
      removePapersFromState(ids);
    } catch (err) {
      console.error(err);
      alert(`Error deleting group "${groupName}". Some items may remain.`);
    }
  };

  // save edit
  const handleSaveEdit = async (updatedPaper) => {
    if (!updatedPaper) return;

    try {
      const serverData = await handleEdit(updatedPaper);
      const finalPaper =
        serverData && serverData._id ? serverData : updatedPaper;

      setFilteredPapers((prev) => {
        if (
          isGrouped &&
          prev &&
          typeof prev === "object" &&
          !Array.isArray(prev)
        ) {
          const newObj = {};
          Object.entries(prev).forEach(([grp, items]) => {
            newObj[grp] = items.map((p) =>
              p._id === finalPaper._id ? finalPaper : p
            );
          });
          return newObj;
        }
        if (Array.isArray(prev)) {
          return prev.map((p) => (p._id === finalPaper._id ? finalPaper : p));
        }
        return prev;
      });

      setEditingPaper(null);
    } catch (err) {
      console.error(err);
      alert("Error saving changes. See console for details.");
    }
  };

  // row action buttons
  const ActionButtons = ({ paper }) => (
    <div className="flex gap-2">
      <button
        onClick={() => setEditingPaper({ ...paper })}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all duration-200"
      >
        Edit
      </button>
      <button
        onClick={() => handleSingleDelete(paper)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-200"
      >
        Delete
      </button>
      <a
        href={paper.fileLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-3 py-1 rounded font-semibold transition-all duration-200 ${buttonCSS}`}
      >
        Download
      </a>
    </div>
  );

  return (
    <div id="papersList" className="mx-20">
      <h2 className={`text-2xl font-bold text-center mb-5 ${textCSS}`}>
        Submitted Papers
      </h2>

      {/* 🔍 Filter */}
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

      {/* 📑 Table */}
      <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md bg-white">
        {isGrouped ? (
          // 📂 Grouped mode
          Object.entries(filteredPapers).map(([group, items]) => (
            <div key={group} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{group}</h3>
                <button
                  onClick={() => handleDeleteGroup(items, group)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-200"
                >
                  Delete Group
                </button>
              </div>

              <table className="min-w-full border-collapse border-none mb-4">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Student Name</th>
                    <th className="px-4 py-2 border">Class</th>
                    <th className="px-4 py-2 border">Section</th>
                    <th className="px-4 py-2 border">Course</th>
                    <th className="px-4 py-2 border">Submission Date</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((paper) => (
                    <tr
                      key={paper._id}
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      {[
                        "title",
                        "studentName",
                        "class",
                        "section",
                        "course",
                        "submissionDate",
                      ].map((key) => (
                        <td key={key} className="px-4 py-2 border">
                          {editingPaper && editingPaper._id === paper._id ? (
                            <input
                              type="text"
                              value={editingPaper[key] ?? ""}
                              onChange={(e) =>
                                setEditingPaper({
                                  ...editingPaper,
                                  [key]: e.target.value,
                                })
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            paper[key]
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-2 border">
                        {editingPaper && editingPaper._id === paper._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(editingPaper)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPaper(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <ActionButtons paper={paper} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          // ➡ Flat list mode
          <table className="min-w-full border-collapse border-none">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Student Name</th>
                <th className="px-4 py-2 border">Class</th>
                <th className="px-4 py-2 border">Section</th>
                <th className="px-4 py-2 border">Course</th>
                <th className="px-4 py-2 border">Submission Date</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredPapers) &&
                filteredPapers.map((paper) => (
                  <tr
                    key={paper._id}
                    className="hover:bg-gray-100 transition-all duration-200"
                  >
                    {[
                      "title",
                      "studentName",
                      "class",
                      "section",
                      "course",
                      "submissionDate",
                    ].map((key) => (
                      <td key={key} className="px-4 py-2 border">
                        {editingPaper && editingPaper._id === paper._id ? (
                          <input
                            type="text"
                            value={editingPaper[key] ?? ""}
                            onChange={(e) =>
                              setEditingPaper({
                                ...editingPaper,
                                [key]: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          paper[key]
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-2 border">
                      {editingPaper && editingPaper._id === paper._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(editingPaper)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPaper(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <ActionButtons paper={paper} />
                      )}
                    </td>
                  </tr>
                ))}

              {Array.isArray(filteredPapers) && filteredPapers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
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
