import React, { useMemo } from "react";

export default function FutureAssignmentsList({
  assignments = [],
  searchTerm = "",
  textCSS,
  buttonCSS,
}) {
  const filtered = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    if (!q) return assignments;
    return assignments.filter(
      (a) =>
        (a.topic || "").toLowerCase().includes(q) ||
        (a.subject || "").toLowerCase().includes(q) ||
        (a.assignedBy || "").toLowerCase().includes(q) ||
        (a.course || "").toLowerCase().includes(q)
    );
  }, [assignments, searchTerm]);

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-3 ${textCSS}`}>
        Upcoming Assignments
      </h2>
      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="text-gray-600">No upcoming assignments.</div>
        )}

        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{a.topic}</h3>
                <p className="text-sm text-gray-600">
                  {a.subject} · {a.course} · Class {a.division} · Year {a.year}
                </p>
                <p className="text-sm text-gray-500">
                  Assigned by: {a.assignedBy}
                </p>
                <p className="text-sm text-gray-500">Due: {a.dueDate}</p>
                <p className="mt-2 text-sm text-gray-700">{a.description}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  className={`px-3 py-1 rounded ${buttonCSS}`}
                  onClick={() => alert("Add to calendar (UI only)")}
                >
                  ➕ Remind Me
                </button>
                <button
                  className={`px-3 py-1 rounded ${buttonCSS}`}
                  onClick={() => alert("View details (UI only)")}
                >
                  🔍 View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
