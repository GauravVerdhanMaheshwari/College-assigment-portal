import React, { useMemo } from "react";

export default function StudentAssignmentsList({
  submissions = [],
  onTogglePublic,
  searchTerm = "",
  textCSS,
  buttonCSS,
}) {
  // filter by search
  const filtered = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    if (!q) return submissions;
    return submissions.filter(
      (s) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.fileName || "").toLowerCase().includes(q) ||
        (s.course || "").toLowerCase().includes(q) ||
        (s.division || "").toLowerCase().includes(q)
    );
  }, [submissions, searchTerm]);

  return (
    <div className="grid gap-4">
      {filtered.length === 0 && (
        <div className="text-gray-600">No submissions found.</div>
      )}

      {filtered.map((s) => (
        <div
          key={s.id}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.fileName}</p>
              <p className="text-sm text-gray-500">Uploaded: {s.uploadedAt}</p>
              <p className="text-sm text-gray-500">
                Class: {s.division} · Course: {s.course} · Year: {s.year}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    s.public ? "bg-green-600" : "bg-gray-400"
                  }`}
                >
                  {s.public ? "Public" : "Private"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded ${buttonCSS}`}
                  onClick={() => alert(`Download (UI only): ${s.fileName}`)}
                >
                  ⬇ Download
                </button>

                <button
                  className={`px-3 py-1 rounded ${buttonCSS}`}
                  onClick={() => onTogglePublic(s.id)}
                >
                  {s.public ? "Make Private" : "Make Public"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
