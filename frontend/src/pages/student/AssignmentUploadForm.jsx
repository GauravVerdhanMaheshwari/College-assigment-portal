import React, { useState } from "react";

function AssignmentUploadForm({ onUpload, buttonCSS }) {
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fileName || !title) {
      alert("Please enter a title and select a file.");
      return;
    }
    onUpload({
      title,
      fileName,
      division: "C",
      course: "C.E",
      year: 5,
      public: false,
    });
    setFileName("");
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Assignment title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        type="file"
        onChange={(e) => setFileName(e.target.files[0]?.name || "")}
        className="border px-2 py-1 rounded"
      />
      <button type="submit" className={`px-4 py-2 rounded ${buttonCSS}`}>
        Upload
      </button>
    </form>
  );
}

export default AssignmentUploadForm;
