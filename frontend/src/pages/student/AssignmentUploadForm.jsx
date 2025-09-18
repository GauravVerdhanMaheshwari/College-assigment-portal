import React, { useState } from "react";

export default function AssignmentUploadForm({ onUpload, buttonCSS }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    fileName: "",
    division: "C",
    course: "C.E",
    year: "5",
    public: false,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.title || !form.fileName) {
      alert("Please provide title and file name (UI-only).");
      return;
    }
    onUpload({
      title: form.title,
      fileName: form.fileName,
      division: form.division,
      course: form.course,
      year: form.year,
      public: form.public,
    });
    setIsOpen(false);
    setForm({
      title: "",
      fileName: "",
      division: "C",
      course: "C.E",
      year: "5",
      public: false,
    });
  };

  return (
    <>
      <button
        className={`px-4 py-2 rounded-lg ${buttonCSS}`}
        onClick={() => setIsOpen(true)}
      >
        + Upload
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl">
            <h3 className="text-lg font-bold mb-4">Upload Submission</h3>

            <input
              name="title"
              placeholder="Assignment title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />
            <input
              name="fileName"
              placeholder="File name (UI-only)"
              value={form.fileName}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <div className="flex gap-2 mb-3">
              <select
                name="division"
                value={form.division}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              >
                <option>C</option>
                <option>B</option>
                <option>A</option>
              </select>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="border p-2 rounded w-1/2"
              >
                <option>C.E</option>
                <option>C.S</option>
                <option>IT</option>
              </select>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.public}
                  onChange={() => setForm((s) => ({ ...s, public: !s.public }))}
                />
                <span>Make submission public</span>
              </label>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="border p-2 rounded w-24 ml-auto"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-[#78350F] text-white"
                onClick={handleSubmit}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
