import React, { useState, useEffect } from "react";
import { Filter } from "./index";

function AssignmentsList({ textCSS }) {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

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
                  <AssignmentCard key={a._id} a={a} />
                ))}
              </div>
            </div>
          ))
        ) : (
          // 📄 RENDER NORMAL LIST
          <div className="grid gap-4">
            {filteredAssignments.map((a) => (
              <AssignmentCard key={a._id} a={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AssignmentCard({ a }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
      <h3 className="text-lg font-bold mb-1">{a.topic}</h3>

      <div className="text-sm space-y-1">
        <p>
          <b>Subject:</b> {a.subject}
        </p>
        <p>
          <b>Assigned By:</b> {a.assignedBy}
        </p>
        <p>
          <b>Assigned To:</b> {a.assignedTo}
        </p>
        <p>
          <b>Due Date:</b> {a.dueDate}
        </p>
        <p className="text-gray-700 mt-2">{a.description}</p>
      </div>
    </div>
  );
}

export default AssignmentsList;
