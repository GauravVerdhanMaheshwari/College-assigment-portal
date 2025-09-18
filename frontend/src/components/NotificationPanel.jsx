import React from "react";

export default function NotificationPanel({
  reports = [],
  onRemove,
  onSendEmail,
  onApprove,
  onDeny,
  theme = {},
}) {
  return (
    <div className="w-80 bg-white rounded-lg shadow-xl p-4">
      <h3 className="font-semibold mb-3">Notifications</h3>
      {reports.length === 0 && (
        <div className="text-gray-500">No notifications</div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {reports.map((r) => (
          <div key={r.id} className="p-3 bg-gray-50 rounded">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {r.requesterName || r.userName}
                </div>
                <div className="text-xs text-gray-600">{r.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {r.requesterEmail || r.userEmail}
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-2">
                {r.status === "pending" ? (
                  <>
                    <button
                      onClick={() => onApprove && onApprove(r.id)}
                      className="text-white bg-green-500 px-3 py-1 rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onDeny && onDeny(r.id)}
                      className="text-white bg-red-500 px-3 py-1 rounded text-sm"
                    >
                      Deny
                    </button>
                  </>
                ) : (
                  <div
                    className={`text-sm ${
                      r.status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.status}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => onSendEmail && onSendEmail(r)}
                className="text-sm px-3 py-1 border rounded"
              >
                Email
              </button>
              <button
                onClick={() => onRemove && onRemove(r.id)}
                className="text-sm px-3 py-1 border rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
