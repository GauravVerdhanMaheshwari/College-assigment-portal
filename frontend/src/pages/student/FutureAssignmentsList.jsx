import React from "react";
import AssignmentUploadForm from "./AssignmentUploadForm.jsx";

function FutureAssignmentsList({
  assignments,
  submissions,
  searchTerm,
  textCSS,
  buttonCSS,
  onUpload,
}) {
  const user = JSON.parse(sessionStorage.getItem("user"))?.student;
  console.log(assignments);

  const allowLateSubmission = assignments?.allowLateSubmission;

  const hasSubmitted = (assignmentId) =>
    submissions.some((s) => s.assignmentId === assignmentId);

  const filtered = assignments.filter((a) =>
    a.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [, forceUpdate] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

  function isWithinGrace(dueDate, graceMinutes = 120) {
    const due = new Date(dueDate).getTime();
    const now = Date.now();
    const graceEnd = due + graceMinutes * 60 * 1000;
    let closed;

    if (allowLateSubmission) {
      closed = now > graceEnd;
    } else {
      closed = null;
    }

    return {
      isLate: now > due,
      withinGrace: now > due && now <= graceEnd,
      closed,
    };
  }

  function getRemainingTime(dueDate, graceMinutes) {
    const end = new Date(dueDate).getTime() + graceMinutes * 60 * 1000;
    const diff = end - Date.now();

    if (diff <= 0) return "Expired";

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (days > 0) return `${days}d ${hrs % 24}h left`;

    return hrs > 0 ? ` ${hrs}h ${mins % 60}m left` : `${mins}m left`;
  }

  return (
    <div className="p-4">
      <h2 className={`text-2xl font-bold mb-4 ${textCSS}`}>
        Upcoming Assignments
      </h2>

      {filtered.length === 0 ? (
        <p className={`${textCSS} italic`}>No upcoming assignments found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((a) => {
            const { isLate, withinGrace, closed } = isWithinGrace(
              a.dueDate,
              a.gracePeriodMinutes
            );

            return (
              <li
                key={a._id}
                className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center"
              >
                {/* LEFT */}
                <div>
                  <h3 className={`font-semibold ${textCSS}`}>{a.topic}</h3>

                  <p className="text-sm text-gray-600">Subject: {a.subject}</p>

                  <p className="text-xs text-gray-400">
                    Due: {new Date(a.dueDate).toLocaleDateString("en-UK")}
                  </p>

                  <p className="text-xs text-gray-400 italic">
                    {a.description}
                  </p>

                  {/* STATUS */}
                  {!isLate && (
                    <span className="inline-block mt-1 text-xs text-green-600 font-semibold">
                      ⏳ On Time
                    </span>
                  )}

                  {!withinGrace && (
                    <p className="text-xs text-orange-600">
                      ⏳ Grace ends in{" "}
                      {getRemainingTime(a.dueDate, a.gracePeriodMinutes)}
                    </p>
                  )}

                  {closed && (
                    <span className="inline-block mt-1 text-xs text-red-600 font-semibold">
                      ❌ Submission Closed
                    </span>
                  )}
                </div>

                {/* RIGHT */}
                {hasSubmitted(a._id) ? (
                  <span className="text-green-600 font-semibold">
                    Submitted ✔
                  </span>
                ) : closed ? (
                  <span className="text-red-500 font-semibold text-sm">
                    Closed
                  </span>
                ) : (
                  <AssignmentUploadForm
                    onUpload={onUpload}
                    studentId={user?._id}
                    assignmentId={a._id}
                    buttonCSS={buttonCSS}
                    isLate={withinGrace}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default FutureAssignmentsList;
