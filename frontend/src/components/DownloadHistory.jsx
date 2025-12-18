import React, { useEffect, useState } from "react";

function DownloadHistory({ paperId }) {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    fetch(`http://localhost:3000/papers/${paperId}/downloads`)
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, [open, paperId]);

  if (history.length === 0 && open) {
    return (
      <div className="mb-2">
        <p className="text-md italic text-gray-500 mt-1">No downloads yet.</p>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-blue-400 underline cursor-pointer"
        >
          {open ? "Hide Download History" : "View Download History"}
        </button>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-blue-400 underline cursor-pointer"
      >
        {open ? "Hide Download History" : "View Download History"}
      </button>

      {open && (
        <div className="mt-2 bg-gray-50 border rounded p-2 space-y-1">
          {history.map((d, i) => (
            <p key={i} className="text-xs text-gray-700">
              📥 <b>{d.role}</b> downloaded on{" "}
              {new Date(d.downloadedAt).toLocaleString()}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default DownloadHistory;
