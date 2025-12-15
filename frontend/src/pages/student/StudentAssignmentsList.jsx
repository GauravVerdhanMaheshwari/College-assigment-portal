import React from "react";

function StudentAssignmentsList({
  submissions,
  onTogglePublic,
  onDelete,
  searchTerm,
  textCSS,
  buttonCSS,
}) {
  const filtered = submissions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {filtered.length === 0 ? (
        <p className={`${textCSS} italic`}>No submissions found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((s) => (
            <li
              key={s._id}
              className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className={`font-semibold ${textCSS}`}>{s.title}</h3>
                <p className="text-xs text-gray-400">
                  Uploaded: {new Date(s.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onTogglePublic(s._id)}
                  className={`px-3 py-1 rounded ${buttonCSS}`}
                >
                  {s.isPublic ? "Make Private" : "Make Public"}
                </button>

                <a
                  href={`http://localhost:3000/papers/${s._id}/download`}
                  className="px-3 py-1 rounded bg-blue-600 text-white"
                >
                  Download
                </a>

                <button
                  onClick={() => onDelete(s._id, s.assignmentId)}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentAssignmentsList;
