import React from "react";

function NotificationPanel({
  reports = [],
  onRemove,
  onSendEmail,
  theme = {},
}) {
  return (
    <div
      className={`w-96 max-h-96 overflow-y-auto p-4 rounded-2xl shadow-2xl`}
      style={{
        backgroundColor: theme.bgColor || "white",
        color: theme.textColor || "#333",
      }}
    >
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports available</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="bg-gray-100 p-3 rounded-lg flex flex-col gap-2 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{report.userName}</p>
                  <p className="text-sm text-gray-600">{report.userEmail}</p>
                  <p className="text-sm mt-1">{report.message}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => onRemove(report.id)}
                  className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove Report
                </button>
                <button
                  onClick={() => onSendEmail(report)}
                  className="flex-1 py-2 px-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Send Email
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationPanel;
