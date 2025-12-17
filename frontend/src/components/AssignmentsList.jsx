import React, { useState, useEffect } from "react";
import { Filter } from "./index";

function AssignmentsList({ textCSS }) {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const facultyId = user?.faculty?._id || null;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch("http://localhost:3000/assignments/");
        if (!response.ok) throw new Error("Failed to fetch assignments");

        const data = await response.json();

        // Normalize dates
        const formatted = data.map((a) => ({
          ...a,
          dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "N/A",
        }));

        setAssignments(formatted);
        setFilteredAssignments(formatted);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  // 🔥 Fields for filtering
  const entityFields = [
    "Topic",
    "Subject",
    "Assigned By",
    "Assigned To",
    "Due Date",
  ];
  const entityKeys = [
    "topic",
    "subject",
    "assignedBy",
    "assignedTo",
    "dueDate",
  ];

  return (
    <div className="p-6 bg-white/40 rounded-2xl shadow-lg">
      <h2 className={`text-2xl font-bold mb-4 ${textCSS}`}>All Assignments</h2>

      {/* 🔎 Filter */}
      <Filter
        data={assignments}
        entityFields={entityFields}
        entityKeys={entityKeys}
        onFilter={(data, grouped) => {
          setFilteredAssignments(data);
          setIsGrouped(grouped);
        }}
      />

      {/* 📄 Assignments */}
      <div className="mt-6">
        {isGrouped ? (
          // 📦 RENDER GROUPED
          Object.keys(filteredAssignments).map((group) => (
            <div key={group} className="mb-8">
              <h3 className="text-xl font-semibold mb-3">{group}</h3>
              <div className="grid gap-4">
                {filteredAssignments[group].map((a) => (
                  <AssignmentCard key={a._id} a={a} facultyId={facultyId} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // 📄 RENDER NORMAL LIST
          <div className="grid gap-4">
            {!filteredAssignments.length && (
              <p className="text-xl text-center text-gray-500 my-4">
                No assignments available
              </p>
            )}
            {filteredAssignments.map((a) => (
              <AssignmentCard key={a._id} a={a} facultyId={facultyId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AssignmentCard({ a, facultyId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [allowLate, setAllowLate] = useState(a.allowLateSubmission);

  // Dropdown lists (same as AssignmentForm)
  const courses = ["CE", "IT", "AI/ML", "CS", "ME"];
  const sections = ["A", "B", "C", "D"];
  const semesters = ["1", "2", "3", "4", "5", "6"];

  // Split assignedTo into parts if possible
  const [selectedCourse, setSelectedCourse] = useState(
    a.assignedTo.split("-")[0] || ""
  );
  const [selectedSemester, setSelectedSemester] = useState(
    a.assignedTo.split("-")[1] || ""
  );
  const [selectedSection, setSelectedSection] = useState(
    a.assignedTo.split("-")[2] || ""
  );

  const [editData, setEditData] = useState({
    topic: a.topic,
    subject: a.subject,
    assignedTo: a.assignedTo,
    description: a.description,
    dueDate: a.dueDate,
    gracePeriodMinutes: a.gracePeriodMinutes ?? 120,
  });

  // Update assignedTo when dropdowns change
  const updateAssignedTo = (course, sem, sec) => {
    if (!course || !sem || !sec) return;
    const value = `${course}-${sem}-${sec}`; // CE-5-C
    setEditData({ ...editData, assignedTo: value });
  };

  const handleUpdateClick = () => {
    console.log("UPDATE CLICKED for:", a._id);
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log("SAVE CLICKED for:", a._id, editData);
    setIsEditing(false);
    fetch(`http://localhost:3000/assignments/${a._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...editData, facultyId: a.facultyId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        alert("Assignment updated successfully!");
        location.reload();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleCancel = () => {
    setEditData({
      topic: a.topic,
      subject: a.subject,
      assignedTo: a.assignedTo,
      description: a.description,
      dueDate: a.dueDate,
    });
    setSelectedCourse(a.assignedTo.split("-")[0] || "");
    setSelectedSemester(a.assignedTo.split("-")[1] || "");
    setSelectedSection(a.assignedTo.split("-")[2] || "");
    setIsEditing(false);
    location.reload();
  };

  const handleDelete = () => {
    console.log("DELETE CLICKED for:", a._id);

    confirm("Are you sure you want to delete this assignment?") &&
      fetch(`http://localhost:3000/assignments/${a._id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          alert("Assignment deleted successfully!");
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    location.reload();
  };

  const canEdit = a.facultyId === facultyId;

  const handleToggleLate = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/assignments/${a._id}/toggle-late`,
        { method: "PATCH" }
      );

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      // ✅ correct React update
      setAllowLate(data.allowLateSubmission);
    } catch (err) {
      alert("Failed to update late submission setting", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
      <div className="flex flex-row justify-between">
        <div className="mx-2 my-4">
          {/* EDIT MODE */}
          {isEditing ? (
            <div className="space-y-3 text-sm">
              {/* TOPIC */}
              <input
                value={editData.topic}
                onChange={(e) =>
                  setEditData({ ...editData, topic: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />

              {/* SUBJECT */}
              <input
                value={editData.subject}
                onChange={(e) =>
                  setEditData({ ...editData, subject: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />

              {/* COURSE / SEMESTER / SECTION */}
              <div className="flex gap-2">
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
                  className="border px-2 py-1 rounded"
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
                    updateAssignedTo(
                      selectedCourse,
                      e.target.value,
                      selectedSection
                    );
                  }}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Sem</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Sec</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />

              {/* DATE */}
              <input
                type="date"
                value={new Date(editData.dueDate).toISOString().split("T")[0]}
                onChange={(e) =>
                  setEditData({ ...editData, dueDate: e.target.value })
                }
                className="border px-2 py-1 rounded w-full"
              />
              <input
                type="number"
                min="0"
                value={editData.gracePeriodMinutes}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    gracePeriodMinutes: Number(e.target.value),
                  })
                }
                className="border px-2 py-1 rounded w-full"
                placeholder="Grace period (minutes)"
              />
            </div>
          ) : (
            /* VIEW MODE */
            <>
              <h3 className="text-lg font-bold mb-1">{a.topic}</h3>
              <div className="text-sm space-y-1">
                <p>
                  <b>Subject:</b> {a.subject}
                </p>
                <p>
                  <b>Assigned To:</b> {a.assignedTo}
                </p>
                <p>
                  <b>Due Date:</b> {a.dueDate}
                </p>
                <p className="text-gray-700 mt-2">{a.description}</p>
              </div>
            </>
          )}
        </div>

        {/* ACTION BUTTONS */}
        {canEdit && (
          <div className="flex flex-col my-auto space-y-2">
            {/* 🕒 LATE SUBMISSION TOGGLE */}
            {!isEditing && (
              <button
                onClick={handleToggleLate}
                className={`text-xs font-semibold rounded px-2 py-1 transition-all
              ${
                allowLate
                  ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                  : "bg-gray-400/10 text-gray-600 hover:bg-gray-400/20"
              }`}
              >
                {allowLate ? "Late Submission: ON" : "Late Submission: OFF"}
              </button>
            )}

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="text-green-400 font-semibold bg-green-400/10 rounded px-2 py-1"
                >
                  Save
                </button>

                <button
                  onClick={handleCancel}
                  className="text-gray-500 font-semibold bg-gray-500/10 rounded px-2 py-1"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdateClick}
                  className="text-blue-400 font-semibold bg-blue-400/10 rounded px-2 py-1"
                >
                  Update
                </button>

                <button
                  onClick={handleDelete}
                  className="text-red-400 font-semibold bg-red-400/10 rounded px-2 py-1"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignmentsList;
