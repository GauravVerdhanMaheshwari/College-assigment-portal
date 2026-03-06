import React, { useState, useEffect, useCallback } from "react";
import { Filter } from "./index";

function AssignmentsList({ textCSS }) {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  const [editingAssignment, setEditingAssignment] = useState(null);
  const [newPdf, setNewPdf] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [updating, setUpdating] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const facultyId = user?.faculty?._id || null;

  /* ===================== FETCH ===================== */
  const fetchAssignments = async () => {
    try {
      const response = await fetch("http://localhost:3000/assignments/");
      if (!response.ok) throw new Error("Failed to fetch assignments");

      const data = await response.json();

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

  useEffect(() => {
    fetchAssignments();
  }, []);

  /* ===================== DELETE GROUP ===================== */
  const handleDeleteGroup = (groupName, groupItems) => {
    if (!window.confirm(`Delete all assignments in "${groupName}" group?`))
      return;

    const idsToDelete = new Set(groupItems.map((a) => a._id));

    setAssignments((prev) => prev.filter((a) => !idsToDelete.has(a._id)));

    setFilteredAssignments((prev) => {
      if (!isGrouped) return prev;
      const updated = { ...prev };
      delete updated[groupName];
      return updated;
    });
  };

  /* ===================== FILTER HANDLERS ===================== */

  const handleFilter = useCallback((data, grouped) => {
    setFilteredAssignments(data);
    setIsGrouped(grouped);
  }, []);

  /* ===================== FILE HANDLERS ===================== */
  const validatePdf = (file) => {
    if (!file) return false;
    if (file.type !== "application/pdf") {
      alert("Only PDF allowed");
      return false;
    }
    return true;
  };

  const handleNewFile = (file) => {
    if (!validatePdf(file)) return;
    setNewPdf(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleNewFile(file);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleNewFile(file);
  };

  /* ===================== UPDATE PDF ===================== */
  const handleUpdatePdf = async () => {
    if (!editingAssignment) return;

    try {
      setUpdating(true);

      const formData = new FormData();
      if (newPdf) formData.append("file", newPdf);
      if (newTitle.trim()) formData.append("fileName", newTitle.trim());

      const res = await fetch(
        `http://localhost:3000/assignments/${editingAssignment._id}/file`,
        { method: "PUT", body: formData },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("PDF updated!");

      setEditingAssignment(null);
      setNewPdf(null);
      setNewTitle("");

      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  /* ===================== FILTER CONFIG ===================== */
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

      <Filter
        data={assignments}
        entityFields={entityFields}
        entityKeys={entityKeys}
        groupableKeys={[]}
        onFilter={handleFilter}
        onDeleteGroup={handleDeleteGroup}
      />

      {/* LIST */}
      <div className="mt-6">
        <div className="grid gap-4">
          {!filteredAssignments.length && (
            <p className="text-xl text-center text-gray-500 my-4">
              No assignments available
            </p>
          )}
          {filteredAssignments.map((a) => (
            <AssignmentCard
              key={a._id}
              a={a}
              facultyId={facultyId}
              setEditingAssignment={setEditingAssignment}
              setNewTitle={setNewTitle}
              refreshList={fetchAssignments}
            />
          ))}
        </div>
      </div>

      {/* ================= PREMIUM MODAL ================= */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/40 p-6">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-[#4C1D95]">
                Update Assignment PDF
              </h3>

              <button
                onClick={() => setEditingAssignment(null)}
                className="text-gray-500 hover:text-red-500 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="PDF title"
              className="w-full border rounded-xl p-2 mb-4"
            />

            <div
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center ${
                dragActive ? "border-purple-500 bg-purple-50" : ""
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={onInputChange}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2">
                Drag & drop PDF or click
              </p>
            </div>

            {newPdf && (
              <p className="text-sm text-green-600 mt-2">📄 {newPdf.name}</p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingAssignment(null)}
                className="px-4 py-2 rounded bg-gray-400 text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdatePdf}
                disabled={updating}
                className="px-5 py-2 rounded bg-[#4C1D95] text-white"
              >
                {updating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== CARD ===================== */
function AssignmentCard({
  a,
  facultyId,
  setEditingAssignment,
  setNewTitle,
  refreshList,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [allowLate, setAllowLate] = useState(a.allowLateSubmission);

  const [editData, setEditData] = useState({
    topic: a.topic,
    subject: a.subject,
    assignedTo: a.assignedTo,
    description: a.description,
    dueDate: a.dueDate,
    gracePeriodMinutes: a.gracePeriodMinutes ?? 120,
  });

  const canEdit = a.facultyId === facultyId;

  const todayISO = new Date().toISOString().split("T")[0];

  const isPastDate = (dateStr) => {
    if (!dateStr) return false;
    const selected = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected < today;
  };

  const handleSave = async () => {
    try {
      if (isPastDate(editData.dueDate)) {
        alert("Due date cannot be in the past");
        return;
      }
      const res = await fetch(`http://localhost:3000/assignments/${a._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editData, facultyId: a.facultyId }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Assignment updated successfully!");
      setIsEditing(false);
      refreshList?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleLate = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/assignments/${a._id}/toggle-late`,
        { method: "PATCH" },
      );
      const data = await res.json();
      setAllowLate(data.allowLateSubmission);
    } catch {
      alert("Failed to update late submission setting");
    }
  };

  return (
    <div className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
      {isEditing ? (
        <div className="space-y-3">
          <input
            value={editData.topic}
            onChange={(e) =>
              setEditData({ ...editData, topic: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <input
            value={editData.subject}
            onChange={(e) =>
              setEditData({ ...editData, subject: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <input
            type="date"
            min={todayISO}
            value={new Date(editData.dueDate).toISOString().split("T")[0]}
            onChange={(e) =>
              setEditData({ ...editData, dueDate: e.target.value })
            }
            className="w-full border rounded-lg p-2"
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingAssignment(a);
                setNewTitle(a.fileName || "");
              }}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              Change PDF
            </button>

            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-bold">{a.topic}</h3>
          <p className="text-sm">Subject: {a.subject}</p>
          <p className="text-sm">Assigned To: {a.assignedTo}</p>
          <p className="text-sm">Due Date: {a.dueDate}</p>

          {canEdit && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 font-semibold bg-blue-400/10 rounded px-2 py-1"
              >
                Update
              </button>

              <button
                onClick={handleToggleLate}
                className="text-xs bg-gray-200 px-2 py-1 rounded"
              >
                {allowLate ? "Late ON" : "Late OFF"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AssignmentsList;
