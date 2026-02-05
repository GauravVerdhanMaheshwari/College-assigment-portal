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
  const [error, setError] = useState("");

  /* ================= FILE VALIDATION ================= */
  const allowedTypes = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF or ZIP files are allowed.");
      e.target.value = "";
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setError("");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!confirm("Are you sure you want to upload this assignment?")) return;

    if (!title || !file) {
      setError("Please provide a title and select a valid file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

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
      setError(err.message);
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

      {/* 📁 FILE INPUT / FILE NAME DISPLAY */}
      {!file ? (
        <input
          type="file"
          accept=".pdf,.zip"
          onChange={handleFileChange}
          className="border px-3 py-2 rounded"
          required
        />
      ) : (
        <div className="flex items-center justify-between border px-3 py-2 rounded bg-gray-50">
          <span className="text-sm truncate">📄 {file.name}</span>
          <button
            type="button"
            onClick={removeFile}
            className="text-red-600 text-sm hover:underline"
          >
            ❌ Remove
          </button>
        </div>
      )}

      <button
        type="submit"
        className={`px-4 py-2 rounded text-white ${buttonCSS} transition-all duration-300`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-sm text-center text-red-600">{error}</p>}
      {message && (
        <p className="text-sm text-center text-green-600">{message}</p>
      )}
    </form>
  );
}

export default AssignmentUploadForm;
