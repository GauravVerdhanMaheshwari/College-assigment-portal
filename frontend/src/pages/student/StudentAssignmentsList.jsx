import React, { useState } from "react";
import { DownloadHistory, DeadlineTimer } from "../../components/index";

function StudentAssignmentsList({
  submissions,
  onTogglePublic,
  onDelete,
  searchTerm,
  textCSS,
  buttonCSS,
}) {
  const [openComments, setOpenComments] = useState(null);

  const filtered = submissions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const seenByFaculty = (downloads = []) =>
    downloads.some((d) => d.role === "faculty");

  const getGradeStyle = (grade) => {
    if (grade === null || grade === undefined)
      return "italic font-bold text-lg text-gray-500";
    if (grade >= 85) return "text-green-700 font-bold text-lg";
    if (grade >= 60) return "text-yellow-400 font-bold text-lg";
    if (grade >= 40) return "text-orange-500 font-bold text-lg";
    return "text-red-600 font-bold text-lg";
  };

  return (
    <div className="p-4">
      <h1 className="my-2 text-2xl font-bold mb-4 text-[#073B4C]">
        Your Submissions
      </h1>
      {filtered.length === 0 ? (
        <p className={`${textCSS} italic`}>No submissions found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((s) => (
            <li key={s._id} className="p-4 bg-white shadow-lg rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <DeadlineTimer dueDate={s.dueDate} />
                <DownloadHistory submissionId={s.downloads} />
                {/* 👀 Seen by Faculty */}
                {seenByFaculty(s.downloads) && (
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                    Seen by Faculty
                  </span>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <h2 className={`font-semibold ${textCSS}`}>
                        Title:{" "}
                        <span className="underline underline-offset-2">
                          {s.title}
                        </span>
                      </h2>
                      <h3 className={`font-semibold ${textCSS}`}>
                        Topic:{" "}
                        <span className="underline underline-offset-2">
                          {s.topic}
                        </span>
                      </h3>
                    </div>
                  </div>
                  {/* 🎓 Grade */}
                  <p className="text-sm mt-1">
                    <span className="font-medium">Grade: </span>
                    <span className={getGradeStyle(s.grade)}>
                      {s.grade !== null && s.grade !== undefined
                        ? `${s.grade} / 100`
                        : "Not graded / Yet to be graded"}
                    </span>
                  </p>
                  {s.isLate && (
                    <span className="mt-1 inline-block px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                      ⚠ Submitted Late
                    </span>
                  )}
                  <p className="text-xs text-gray-400">
                    Uploaded: {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">
                    Deadline: {new Date(s.dueDate).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Submitted: {new Date(s.submittedAt).toLocaleString()}
                  </p>
                </div>

                {/* 🎛 Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onTogglePublic(s._id)}
                    className={`px-3 py-1 rounded ${buttonCSS} cursor-pointer`}
                  >
                    {s.isPublic ? "Make Private" : "Make Public"}
                  </button>

                  <a
                    href={`http://localhost:3000/papers/${s._id}/download`}
                    className="px-3 py-1 rounded bg-blue-400 text-white text-center hover:bg-blue-500 transition-all duration-200 cursor-pointer"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => onDelete(s._id, s.assignmentId)}
                    disabled={s.grade !== null && s.grade !== undefined}
                    title={
                      s.grade !== null && s.grade !== undefined
                        ? "Cannot delete after grading"
                        : "Delete submission"
                    }
                    className={`px-3 py-1 rounded text-white ${
                      s.grade !== null && s.grade !== undefined
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 cursor-pointer"
                    } duration-200 transition-all`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* 💬 Faculty Feedback */}
              <div className="mt-3 text-center">
                <button
                  onClick={() =>
                    setOpenComments(openComments === s._id ? null : s._id)
                  }
                  className="text-sm text-blue-600 underline"
                >
                  {openComments === s._id
                    ? "Hide Faculty Feedback"
                    : "View Faculty Feedback"}
                </button>

                {openComments === s._id && (
                  <div className="mt-2 bg-gray-50 border rounded p-3 space-y-2">
                    {s.comments && s.comments.length > 0 ? (
                      s.comments.map((c) => (
                        <div key={c._id}>
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">
                              {c.facultyName}:
                            </span>{" "}
                            {c.text}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(c.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm italic text-gray-500">
                        No feedback yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentAssignmentsList;
