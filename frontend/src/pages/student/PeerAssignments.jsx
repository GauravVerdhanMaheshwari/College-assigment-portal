import React, { useState } from "react";

function PeerAssignments({ assignments, textCSS, buttonCSS }) {
  const [search, setSearch] = useState("");

  const filtered = assignments.filter(
    (a) =>
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.topic.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className={`text-3xl font-bold mb-6 ${textCSS}`}>Peer Assignments</h2>
      <input
        type="text"
        placeholder="Search peer assignments..."
        className="border border-gray-300 rounded-lg p-2 mb-6 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-6">
        {filtered.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">{assignment.topic}</h3>
            <p className="text-gray-600">{assignment.subject}</p>
            <p className="text-sm text-gray-500">
              By: {assignment.studentName}
            </p>
            <div className="mt-4">
              {assignment.open ? (
                <button className={`px-4 py-2 rounded-lg ${buttonCSS}`}>
                  View Assignment
                </button>
              ) : (
                <button
                  className={`px-4 py-2 rounded-lg ${buttonCSS}`}
                  onClick={() =>
                    alert(
                      `Requested access to ${assignment.studentName}'s work`
                    )
                  }
                >
                  Request Access
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PeerAssignments;
