import React, { useState } from "react";

function AssignmentForm({ textCSS, buttonCSS }) {
  const [assignment, setAssignment] = useState({
    topic: "",
    subject: "",
    assignedBy: "",
    assignedTo: "",
    dueDate: "",
    description: "",
  });

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Assignment added:", assignment);
    alert("Assignment scheduled (UI only)!");
    setAssignment({
      topic: "",
      subject: "",
      assignedBy: "",
      assignedTo: "",
      dueDate: "",
      description: "",
    });
  };

  return (
    <div className="p-6 bg-white/40 rounded-2xl shadow-lg">
      <h2 className={`text-2xl font-bold mb-4 ${textCSS}`}>
        Add New Assignment
      </h2>
      <div className="grid gap-4">
        <input
          name="topic"
          placeholder="Topic"
          value={assignment.topic}
          onChange={handleChange}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition duration-200 ease-in-out active:shadow-sm"
        />
        <input
          name="subject"
          placeholder="Subject"
          value={assignment.subject}
          onChange={handleChange}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition duration-200 ease-in-out active:shadow-sm"
        />
        <input
          name="assignedBy"
          placeholder="Assigned By"
          value={assignment.assignedBy}
          onChange={handleChange}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition duration-200 ease-in-out active:shadow-sm"
        />
        <input
          name="assignedTo"
          placeholder="Assigned To (Class)"
          value={assignment.assignedTo}
          onChange={handleChange}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition duration-200 ease-in-out active:shadow-sm"
        />
        <input
          type="date"
          name="dueDate"
          value={assignment.dueDate}
          onChange={handleChange}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition duration-200 ease-in-out active:shadow-sm"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={assignment.description}
          onChange={handleChange}
          className="border p-2 rounded bg-white/70 shadow-md hover:shadow-lg transition duration-200 ease-in-out active:shadow-sm"
        />
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded ${buttonCSS}`}
        >
          Add Assignment
        </button>
      </div>
    </div>
  );
}

export default AssignmentForm;
