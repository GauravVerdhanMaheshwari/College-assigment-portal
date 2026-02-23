import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";

function AddUsers({
  userToAdd = [],
  userDataBaseEntry = {},
  selectOptions = {},
  courseSubjectMap = {},
  handleAddUser,
}) {
  const [user, setUser] = useState(userToAdd?.[0] || "");
  const [userAPI, setUserAPI] = useState((userToAdd?.[0] || "").toLowerCase());
  const [userDetails, setUserDetails] = useState({});
  const [uploadSummary, setUploadSummary] = useState(null);
  const [uploading, setUploading] = useState(false);
  const selectedCourses = userDetails.course || [];

  // 🛡️ SAFE FIELD LIST
  const currentFields = useMemo(() => {
    return userDataBaseEntry?.[user] || [];
  }, [userDataBaseEntry, user]);

  const MultiSelect = ({
    label,
    options = [],
    value = [],
    onChange,
    disabled = false,
  }) => {
    const toggleValue = (val) => {
      if (disabled) return;

      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
    };

    return (
      <div
        className={`border rounded-xl p-3 transition
        ${disabled ? "bg-gray-100 opacity-60" : "bg-gray-50"}
      `}
      >
        <p className="font-medium text-gray-700 mb-2">
          {label}
          {disabled && (
            <span className="text-xs text-red-500 ml-2">
              (Select IT course first)
            </span>
          )}
        </p>

        <div className="flex flex-wrap gap-2">
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => toggleValue(opt)}
              className={`px-3 py-1 rounded-full text-sm transition
              ${
                value.includes(opt)
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                  : "bg-white border hover:bg-gray-100"
              }
              ${disabled ? "cursor-not-allowed" : ""}
            `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 📊 Preview helpers
  const getPreviewHeaders = () => currentFields.map((f) => f.field);

  const getAllowedSubjects = () => {
    if (!selectedCourses.length) return [];

    const allowed = new Set();

    selectedCourses.forEach((course) => {
      const mapped = courseSubjectMap?.[course];
      if (mapped) {
        mapped.forEach((s) => allowed.add(s));
      }
    });

    return Array.from(allowed);
  };

  const getPreviewRow = () => {
    const row = {};
    currentFields.forEach((f) => {
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

  // 📂 Excel Upload
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
        try {
          const cleanRow = normalizeRow(rows[i]);
          const result = await handleAddUser(user, userAPI, cleanRow);

          if (result?.success) {
            successCount++;
          } else {
            failed.push({
              row: i + 2,
              reason: result?.message || "Unknown error",
            });
          }
        } catch (err) {
          failed.push({
            row: i + 2,
            reason: "Processing error",
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
    <div className="w-full px-4">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        ✨ Add Users
      </h2>

      {/* Card */}
      <div className="backdrop-blur-lg bg-white/90 border border-white/30 shadow-2xl rounded-2xl p-6 mx-auto max-w-5xl">
        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {userToAdd?.map((u, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200
                ${
                  user === u
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
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
        </div>

        {/* Manual Form */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-3">
          {currentFields.length === 0 ? (
            <p className="text-center text-red-500 font-medium">
              ⚠ No fields configured for this user type
            </p>
          ) : (
            currentFields.map((field, index) => {
              // ✅ MULTISELECT FIELD
              if (field.type === "multiselect") {
                // 🎯 SUBJECT SPECIAL LOGIC
                if (field.field === "subject") {
                  const allowedSubjects = getAllowedSubjects();
                  const isDisabled = !selectedCourses.includes("IT");

                  return (
                    <MultiSelect
                      key={index}
                      label="Subject"
                      options={allowedSubjects}
                      value={userDetails.subject || []}
                      disabled={isDisabled}
                      onChange={(val) =>
                        setUserDetails({
                          ...userDetails,
                          subject: val,
                        })
                      }
                    />
                  );
                }

                // ✅ NORMAL MULTISELECT
                return (
                  <MultiSelect
                    key={index}
                    label={
                      field.field.charAt(0).toUpperCase() + field.field.slice(1)
                    }
                    options={selectOptions?.[field.field] || []}
                    value={userDetails[field.field] || []}
                    onChange={(val) =>
                      setUserDetails({
                        ...userDetails,
                        [field.field]: val,
                      })
                    }
                  />
                );
              }
            })
          )}
        </div>

        {/* Add Button */}
        <div className="flex justify-center">
          <button
            className="mt-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-105 transition text-white px-6 py-2 rounded-xl shadow-lg font-semibold"
            onClick={async () => {
              const result = await handleAddUser(user, userAPI, userDetails);
              if (result?.success) {
                alert(`${user} added successfully`);
                setUserDetails({});
              } else {
                alert(result?.message || "Failed to add user");
              }
            }}
          >
            🚀 Add {user}
          </button>
        </div>

        {/* Excel Upload */}
        <div className="mt-8 text-center">
          <label className="font-semibold text-gray-700">
            📂 Or Upload Excel File
          </label>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="mt-3 p-2 border rounded-lg w-full max-w-sm mx-auto"
          />

          {uploading && (
            <p className="text-blue-600 mt-2 font-medium">
              ⏳ Uploading users…
            </p>
          )}

          {/* Summary */}
          {uploadSummary && (
            <div className="mt-4 border rounded-xl p-4 max-w-md mx-auto bg-gray-50">
              <p className="font-bold text-gray-800">✅ Upload Completed</p>
              <p className="text-green-700">
                ✔ Success: {uploadSummary.success}
              </p>
              <p className="text-red-700">
                ✖ Failed: {uploadSummary.failed.length}
              </p>

              {uploadSummary.failed.length > 0 && (
                <ul className="mt-2 text-sm text-red-600 list-disc ml-5 text-left">
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
