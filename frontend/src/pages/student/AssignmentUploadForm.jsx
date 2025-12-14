import React, { useState } from "react";

function AssignmentUploadForm({
  onUpload,
  buttonCSS,
  studentId,
  assignmentId,
}) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      alert("Please provide a title and select a file.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("studentId", studentId);
      formData.append("assignmentId", assignmentId);

      const res = await fetch("http://localhost:3000/papers/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setMessage("Assignment uploaded successfully!");
      setTitle("");
      setFile(null);
      onUpload && onUpload(data.paper);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Assignment title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-3 py-2 rounded"
        required
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0] || null)}
        className="border px-3 py-2 rounded"
        required
      />

      <button
        type="submit"
        className={`px-4 py-2 rounded bg--600 text-white ${buttonCSS} duration-300 transition-all ease-in-out cursor-pointer flex justify-center items-center`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p className="text-sm text-center text-green-600">{message}</p>
      )}
    </form>
  );
}

export default AssignmentUploadForm;
