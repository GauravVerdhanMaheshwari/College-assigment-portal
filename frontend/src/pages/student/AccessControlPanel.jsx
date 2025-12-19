import React from "react";

function AccessControlPanel() {
  const [permissions, setPermissions] = React.useState([]);

  React.useEffect(() => {
    setPermissions([
      {
        paperId: "paper1",
        subject: "Math",
        studentName: "Alice",
        accessStatus: "granted",
      },
      {
        paperId: "paper2",
        subject: "Science",
        studentName: "Bob",
        accessStatus: "revoked",
      },
      {
        paperId: "paper3",
        subject: "History",
        studentName: "Charlie",
        accessStatus: "requested",
      },
    ]);
  }, []);

  const handlePermissionChange = (paperId, action) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.paperId === paperId
          ? {
              ...perm,
              accessStatus: action === "grant" ? "granted" : "revoked",
            }
          : perm
      )
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#073B4C]">
        Access Control Panel
      </h1>
      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-[#073B4C]">
              Paper ID
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-[#073B4C]">
              Subject
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-[#073B4C]">
              Student Name
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-[#073B4C]">
              Access
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-center text-[#073B4C] ">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((perm) => (
            <tr key={perm.paperId}>
              <td className="py-2 px-4 border-b border-gray-200 text-[#073B4C]">
                {perm.paperId}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-[#073B4C]">
                {perm.subject}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-[#073B4C]">
                {perm.studentName}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-[#073B4C]">
                {perm.accessStatus}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-[#073B4C] justify-center flex">
                {perm.accessStatus === "requested" ||
                perm.accessStatus === "revoked" ? (
                  <button
                    className="mr-2 px-3 py-1 bg-green-400 text-white rounded hover:bg-green-500 cursor-pointer transition-all duration-150 ease-in-out"
                    onClick={() =>
                      handlePermissionChange(perm.paperId, "grant")
                    }
                  >
                    Grant
                  </button>
                ) : null}
                {perm.accessStatus === "granted" && (
                  <button
                    className="mr-2 px-3 py-1 bg-red-400 text-white rounded hover:bg-red-500 cursor-pointer transition-all duration-150 ease-in-out"
                    onClick={() =>
                      handlePermissionChange(perm.paperId, "revoke")
                    }
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
