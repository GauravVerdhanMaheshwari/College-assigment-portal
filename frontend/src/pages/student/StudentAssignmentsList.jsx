import React from "react";

function StudentAssignmentsList({
  submissions,
  onTogglePublic,
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
              key={s.id}
              className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className={`font-semibold ${textCSS}`}>{s.title}</h3>
                <p className="text-sm text-gray-500">{s.fileName}</p>
                <p className="text-xs text-gray-400">
                  Uploaded: {s.uploadedAt}
                </p>
              </div>
              <button
                onClick={() => onTogglePublic(s.id)}
                className={`px-4 py-2 rounded transition ${buttonCSS}`}
              >
                {s.public ? "Make Private" : "Make Public"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentAssignmentsList;
