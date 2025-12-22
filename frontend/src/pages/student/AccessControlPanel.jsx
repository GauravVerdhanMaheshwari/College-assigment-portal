import React, { useEffect, useState } from "react";

function AccessControlPanel() {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(sessionStorage.getItem("user")).student;

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/access-control/requests/${user._id}`
        );
        const data = await res.json();
        setPermissions(data);
      } catch (err) {
        console.error("Error fetching access requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const updateAccess = async (paperId, requestedBy, action) => {
    try {
      const res = await fetch(
        `http://localhost:3000/access-control/${action}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paperId,
            requestedBy:
              typeof requestedBy === "string" ? requestedBy : requestedBy._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error("Failed to update access");
      }

      setPermissions((prev) =>
        prev.map((p) =>
          p.paperId._id === paperId &&
          (typeof p.requestedBy === "string"
            ? p.requestedBy
            : p.requestedBy._id) === requestedBy
            ? {
                ...p,
                accessStatus: action === "grant" ? "granted" : "revoked",
              }
            : p
        )
      );
    } catch (err) {
      console.error("Update access failed:", err);
    }
  };

  console.log(permissions);

  if (loading) return <p>Loading access requests...</p>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-[#073B4C] mb-4">
        Paper Access Requests
      </h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Paper Title</th>
            <th className="p-3 text-left">Assignment Title</th>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Requested By</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {permissions.map((perm) => (
            <tr key={perm._id} className="border-b">
              <td className="p-3">{perm.paperId.title}</td>
              <td className="p-3">{perm.paperId.assignmentId?.topic || "—"}</td>
              <td className="p-3">
                {perm.paperId.assignmentId?.subject || "—"}
              </td>
              <td className="p-3">
                {perm.requestedBy.name}
                <div className="text-xs text-gray-500">
                  {perm.requestedBy.enrollmentNumber || perm.requestedBy.email}
                </div>
              </td>
              <td className="p-3 capitalize">{perm.accessStatus}</td>
              <td className="p-3 text-center">
                {perm.accessStatus !== "granted" && (
                  <button
                    onClick={() =>
                      updateAccess(
                        perm.paperId._id,
                        perm.requestedBy._id,
                        "grant"
                      )
                    }
                    className="px-3 py-1 mr-2 bg-green-500 text-white rounded"
                  >
                    Grant
                  </button>
                )}
                {perm.accessStatus === "granted" && (
                  <button
                    onClick={() =>
                      updateAccess(
                        perm.paperId._id,
                        perm.requestedBy._id,
                        "revoke"
                      )
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AccessControlPanel;
