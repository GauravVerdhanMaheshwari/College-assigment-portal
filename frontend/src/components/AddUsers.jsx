import React, { useState } from "react";
import * as XLSX from "xlsx";

function AddUsers({ userToAdd, userDataBaseEntry, handleAddUser }) {
  const [user, setUser] = useState(userToAdd[0]);
  const [userAPI, setUserAPI] = useState(userToAdd[0].toLowerCase());
  const [userDetails, setUserDetails] = useState({});
  const [uploadSummary, setUploadSummary] = useState(null);
  const [uploading, setUploading] = useState(false);

  const getPreviewHeaders = () => {
    if (!userDataBaseEntry[user]) return [];
    return userDataBaseEntry[user].map((f) => f.field);
  };

  const getPreviewRow = () => {
    if (!userDataBaseEntry[user]) return {};
    const row = {};
    userDataBaseEntry[user].forEach((f) => {
      row[f.field] = "example";
    });
    return row;
  };

  const normalizeRow = (row) => {
    const normalized = {};
    Object.keys(row).forEach((key) => {
      normalized[key.trim().toLowerCase()] = row[key];
    });
    return normalized;
  };

  // 📂 Excel Upload with Summary
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSummary(null);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      let successCount = 0;
      let failed = [];

      for (let i = 0; i < rows.length; i++) {
        const cleanRow = normalizeRow(rows[i]);
        const result = await handleAddUser(user, userAPI, cleanRow);

        if (result.success) {
          successCount++;
        } else {
          failed.push({
            row: i + 2, // Excel row number
            reason: result.message,
          });
        }
      }

      setUploadSummary({
        total: rows.length,
        success: successCount,
        failed,
      });

      setUploading(false);
    };

    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-5 mt-2 font-bold text-center text-white">
        Add Users
      </h2>

      <div className="p-4 bg-white rounded shadow-md mx-20 mb-10 flex flex-col items-center">
        {/* Tabs */}
        <div className="mb-4">
          <ul className="flex gap-5">
            {userToAdd.map((u, index) => (
              <button
                key={index}
                className="bg-[#0EA5E9] text-white p-2 rounded"
                onClick={() => {
                  setUser(u);
                  setUserAPI(u.toLowerCase());
                  setUserDetails({});
                  setUploadSummary(null);
                }}
              >
                {u}
              </button>
            ))}
          </ul>
        </div>

        {/* Manual Form */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {userDataBaseEntry[user].map((field, index) => (
            <input
              key={index}
              type={field.type}
              placeholder={
                field.field.charAt(0).toUpperCase() +
                field.field.slice(1).replace(/([A-Z])/g, " $1")
              }
              className="p-2 border rounded"
              value={userDetails[field.field] || ""}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  [field.field]: e.target.value,
                })
              }
            />
          ))}
        </div>

        {/* Add Single User */}
        <button
          className="mt-4 bg-[#0EA5E9] text-white px-4 py-2 rounded"
          onClick={async () => {
            const result = await handleAddUser(user, userAPI, userDetails);
            if (result.success) {
              alert(`${user} added successfully`);
              setUserDetails({});
            } else {
              alert(result.message);
            }
          }}
        >
          Add {user}
        </button>

        {/* Excel Upload */}
        <div className="mt-6 flex flex-col items-center w-full">
          <label className="font-semibold mb-2">Or Upload Excel File:</label>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="p-2 border rounded w-full max-w-sm"
          />

          {/* Excel Format Preview */}
          {userDataBaseEntry[user] && (
            <div className="mt-6 w-full max-w-4xl bg-gray-50 border rounded p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Excel Format Preview ({user})
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                Excel headers must match these field names
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      {getPreviewHeaders().map((key) => (
                        <th
                          key={key}
                          className="border px-3 py-2 text-left font-semibold"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="bg-white">
                      {Object.values(getPreviewRow()).map((val, idx) => (
                        <td
                          key={idx}
                          className="border px-3 py-2 text-gray-500"
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploading && (
            <p className="text-blue-600 mt-2">⏳ Uploading users…</p>
          )}

          {/* Upload Summary */}
          {uploadSummary && (
            <div className="mt-4 w-full max-w-md border rounded p-3">
              <p className="font-semibold">Upload Completed</p>
              <p className="text-green-700">
                ✔ Success: {uploadSummary.success}
              </p>
              <p className="text-red-700">
                ✖ Failed: {uploadSummary.failed.length}
              </p>

              {uploadSummary.failed.length > 0 && (
                <ul className="mt-2 text-sm text-red-600 list-disc ml-5">
                  {uploadSummary.failed.map((f, i) => (
                    <li key={i}>
                      Row {f.row}: {f.reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddUsers;
