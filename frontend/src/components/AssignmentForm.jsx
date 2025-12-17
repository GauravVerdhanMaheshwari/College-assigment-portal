import React, { useState } from "react";

function AssignmentForm({ textCSS, buttonCSS }) {
  const courses = ["CE", "IT", "AI/ML", "CS", "ME"];
  const sections = ["A", "B", "C", "D"];
  const semesters = ["1", "2", "3", "4", "5"];

  const [assignment, setAssignment] = useState({
    topic: "",
    subject: "",
    facultyId: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))?.faculty._id
      : alert("Please login as faculty to add assignments"),
    assignedTo: "",
    dueDate: "",
    description: "",
  });

  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const updateAssignedTo = (course, sem, sec) => {
    if (!course || !sem || !sec) return;
    const value = `${course}-${sem}-${sec}`;
    setAssignment({ ...assignment, assignedTo: value });
  };

  const handleAddAssignment = async () => {
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
      const response = await fetch("http://localhost:3000/assignments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignment),
      });
      if (!response.ok) {
        throw new Error("Failed to add assignment");
      }
      alert("Assignment added successfully!");
      // Reset form
      setAssignment({
        topic: "",
        subject: "",
        facultyId: sessionStorage.getItem("user")
          ? JSON.parse(sessionStorage.getItem("user"))?.faculty._id
          : "",
        assignedTo: "",
        dueDate: "",
        description: "",
      });
      setSelectedCourse("");
      setSelectedSection("");
      setSelectedSemester("");
      location.reload();
    } catch (error) {
      console.log(error);
      alert(error.message);
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
        <input
          name="subject"
          placeholder="Subject"
          value={assignment.subject}
          onChange={(e) =>
            setAssignment({ ...assignment, subject: e.target.value })
          }
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
        />

        <div className="flex gap-4">
          {/* COURSE */}
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              updateAssignedTo(
                e.target.value,
                selectedSemester,
                selectedSection
              );
            }}
            className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
          >
            <option value="">Course</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* SEMESTER */}
          <select
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              updateAssignedTo(selectedCourse, e.target.value, selectedSection);
            }}
            className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
          >
            <option value="">Semester</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          {/* SECTION */}
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              updateAssignedTo(
                selectedCourse,
                selectedSemester,
                e.target.value
              );
            }}
            className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition"
          >
            <option value="">Section</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <input
          type="date"
          name="dueDate"
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
