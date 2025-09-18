import React, { useState } from "react";

function StudentAssignmentUpload({ assignment, onClose }) {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }
    alert(
      `Uploaded ${file.name} for ${assignment.topic} (${assignment.subject})`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          Upload for {assignment.topic}
        </h2>
        <input
          type="file"
          className="mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 rounded-lg bg-[#78350F] hover:bg-[#78350F]/80 text-white"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentAssignmentUpload;
