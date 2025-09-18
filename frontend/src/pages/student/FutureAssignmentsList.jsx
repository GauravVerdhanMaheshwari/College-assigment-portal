import React from "react";
import AssignmentUploadForm from "./AssignmentUploadForm";

function FutureAssignmentsList({
  assignments,
  searchTerm,
  textCSS,
  buttonCSS,
  onUpload,
}) {
  const filtered = assignments.filter((a) =>
    a.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-4 ${textCSS}`}>
        Upcoming Assignments
      </h2>
      {filtered.length === 0 ? (
        <p className={`${textCSS} italic`}>No upcoming assignments found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((a) => (
            <li
              key={a.id}
              className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className={`font-semibold ${textCSS}`}>{a.topic}</h3>
                <p className="text-sm text-gray-600">Subject: {a.subject}</p>
                <p className="text-xs text-gray-400">Due: {a.dueDate}</p>
                <p className="text-xs text-gray-400 italic">{a.description}</p>
              </div>
              <AssignmentUploadForm onUpload={onUpload} buttonCSS={buttonCSS} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FutureAssignmentsList;
