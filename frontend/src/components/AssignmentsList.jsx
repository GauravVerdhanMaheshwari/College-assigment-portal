import React, { useState } from "react";
import { Filter } from "./index";

function AssignmentsList({ assignments, textCSS }) {
  const [filteredAssignments, setFilteredAssignments] = useState(assignments);
  const [isGrouped, setIsGrouped] = useState(false);

  const entityFields = [
    "Topic",
    "Subject",
    "Assigned By",
    "Assigned To",
    "Due Date",
    "Division",
    "Course",
    "Year",
  ];
  const entityKeys = [
    "topic",
    "subject",
    "assignedBy",
    "assignedTo",
    "dueDate",
    "division",
    "course",
    "year",
  ];

  return (
    <div className="p-6 bg-white/40 rounded-2xl shadow-lg">
      <h2 className={`text-2xl font-bold mb-4 ${textCSS}`}>All Assignments</h2>

      {/* 🔎 Filter Section */}
      <Filter
        data={assignments}
        entityFields={entityFields}
        entityKeys={entityKeys}
        onFilter={(data, grouped) => {
          setFilteredAssignments(data);
          setIsGrouped(grouped);
        }}
      />

      {/* 📂 Render Assignments */}
      {isGrouped
        ? Object.keys(filteredAssignments).map((group) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{group}</h3>
              {filteredAssignments[group].map((a) => (
                <div
                  key={a.id}
                  className="mb-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold">{a.topic}</h3>
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
                    <b>Division:</b> {a.division}
                  </p>
                  <p>
                    <b>Course:</b> {a.course}
                  </p>
                  <p>
                    <b>Year:</b> {a.year}
                  </p>
                  <p>
                    <b>Due Date:</b> {a.dueDate}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{a.description}</p>
                </div>
              ))}
            </div>
          ))
        : filteredAssignments.map((a) => (
            <div
              key={a.id}
              className="mb-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{a.topic}</h3>
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
                <b>Division:</b> {a.division}
              </p>
              <p>
                <b>Course:</b> {a.course}
              </p>
              <p>
                <b>Year:</b> {a.year}
              </p>
              <p>
                <b>Due Date:</b> {a.dueDate}
              </p>
              <p className="text-sm text-gray-700 mt-2">{a.description}</p>
            </div>
          ))}
    </div>
  );
}

export default AssignmentsList;
