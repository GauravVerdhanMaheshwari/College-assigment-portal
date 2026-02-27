import React, { useState, useMemo } from "react";

function AssignmentForm({ textCSS, buttonCSS }) {
  // ✅ faculty info from sessionStorage
  const faculty = useMemo(() => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      return user?.faculty || {};
    } catch {
      return {};
    }
  }, []);

  // ✅ allocated options
  const allocatedCourses = faculty.course || [];
  const allocatedSemesters = faculty.semester || [];
  const allocatedSections = faculty.division || [];
  const allocatedSubjects = faculty.subject || [];

  const [assignment, setAssignment] = useState({
    topic: "",
    subject: "",
    facultyId: faculty._id || "",
    assignedTo: "",
    dueDate: "",
    description: "",
  });

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    setPdfFile(file);
  };

  // ✅ today's date
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // 🔄 update assignedTo dynamically
  const updateAssignedTo = (course, sem, sec) => {
    if (!course || !sem || !sec) return;
    setAssignment((prev) => ({
      ...prev,
      assignedTo: `${course}-${sem}-${sec}`,
    }));
  };

  const handleAddAssignment = async () => {
    // 🔴 past-date protection
    if (assignment.dueDate && assignment.dueDate < today) {
      alert("Due date cannot be in the past");
      return;
    }

    // 🔴 all fields must be filled
    if (
      !assignment.topic ||
      !assignment.subject ||
      !assignment.assignedTo ||
      !assignment.dueDate ||
      !assignment.description
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      let fileData = null;

      /* ================= UPLOAD PDF FIRST ================= */
      if (pdfFile) {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", pdfFile);

        const uploadRes = await fetch(
          "http://localhost:3000/assignments/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const text = await uploadRes.text();
        console.log("Upload response:", uploadRes.status, text);

        if (!uploadRes.ok) {
          throw new Error(`PDF upload failed: ${text}`);
        }

        fileData = JSON.parse(text);
      }

      /* ================= CREATE ASSIGNMENT ================= */
      const payload = {
        ...assignment,
        fileId: fileData?.fileId || null,
        fileName: fileData?.fileName || "",
      };

      const res = await fetch("http://localhost:3000/assignments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add assignment");

      alert("Assignment added successfully!");

      // reset
      setPdfFile(null);
      setAssignment({
        topic: "",
        subject: "",
        facultyId: faculty._id,
        assignedTo: "",
        dueDate: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white/40 rounded-2xl shadow-lg">
      <h2 className={`text-2xl font-bold mb-4 ${textCSS}`}>
        Add New Assignment
      </h2>
      <div className="grid gap-4">
        {/* TOPIC */}
        <input
          name="topic"
          placeholder="Topic"
          value={assignment.topic}
          onChange={(e) =>
            setAssignment({ ...assignment, topic: e.target.value })
          }
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
        />

        {/* SUBJECT */}
        <select
          value={selectedSubject}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedSubject(val);
            setAssignment((prev) => ({ ...prev, subject: val }));
          }}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
        >
          <option value="">Select Subject</option>
          {allocatedSubjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>

        {/* COURSE / SEM / SECTION */}
        <div className="flex gap-4">
          <select
            value={selectedCourse}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCourse(val);
              updateAssignedTo(val, selectedSemester, selectedSection);
            }}
            className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
          >
            <option value="">Course</option>
            {allocatedCourses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedSemester}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSemester(val);
              updateAssignedTo(selectedCourse, val, selectedSection);
            }}
            className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
          >
            <option value="">Semester</option>
            {allocatedSemesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedSection(val);
              updateAssignedTo(selectedCourse, selectedSemester, val);
            }}
            className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
          >
            <option value="">Section</option>
            {allocatedSections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* DUE DATE */}
        <input
          type="date"
          name="dueDate"
          min={today}
          value={assignment.dueDate}
          onChange={(e) =>
            setAssignment({ ...assignment, dueDate: e.target.value })
          }
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={assignment.description}
          onChange={(e) =>
            setAssignment({ ...assignment, description: e.target.value })
          }
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
        />

        {/* PDF UPLOAD */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
        />

        {pdfFile && (
          <p className="text-sm text-green-600">📄 Selected: {pdfFile.name}</p>
        )}

        {/* SUBMIT */}
        <button
          onClick={handleAddAssignment}
          className={`px-4 py-2 rounded ${buttonCSS}`}
        >
          Add Assignment
        </button>
      </div>
    </div>
  );
}

export default AssignmentForm;
