import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";

// 🔥 Courses → Subjects mapping
const COURSE_SUBJECT_MAP = {
  IT: ["DBMS", "OS", "CN", "SE", "DS"],
  CE: ["Thermodynamics", "Fluid Mechanics", "Structural Analysis"],
  BCA: ["C Programming", "Java", "Web Development"],
  MCA: ["Advanced Java", "Cloud Computing", "AI", "Big Data"],
};

const DIVISIONS = ["A", "B", "C", "D"];
const SEMESTERS = [1, 2, 3, 4, 5, 6];

function AddUsers({
  userToAdd = ["Library Managers", "User Managers", "Students", "Faculties"],
  userDataBaseEntry = {},
  handleAddUser,
}) {
  const [selectedUser, setSelectedUser] = useState(userToAdd[0]);
  const [userAPI, setUserAPI] = useState(
    userToAdd[0].toLowerCase().replace(" ", "-"),
  );
  const [userDetails, setUserDetails] = useState({});
  const [facultySmart, setFacultySmart] = useState({}); // for courses/subjects multi-select
  const [uploadSummary, setUploadSummary] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 📌 Allowed subjects dynamically based on courses
  const allowedSubjects = useMemo(() => {
    if (!facultySmart.course?.length) return [];
    const subjectsSet = new Set();
    facultySmart.course.forEach((course) => {
      (COURSE_SUBJECT_MAP[course] || []).forEach((s) => subjectsSet.add(s));
    });
    return Array.from(subjectsSet);
  }, [facultySmart.course]);

  const areSubjectsEnabled = allowedSubjects.length > 0;

  // 📂 Handle multi-select change
  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setFacultySmart((prev) => {
      let updated = { ...prev, [name]: values };
      if (name === "course") {
        updated.subject =
          prev.subject?.filter((sub) =>
            values.some((course) =>
              (COURSE_SUBJECT_MAP[course] || []).includes(sub),
            ),
          ) || [];
      }
      return updated;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  // 📂 Submit single user
  const handleSingleAdd = async () => {
    const finalData = { ...userDetails };
    // For Students/Faculties, include multi-select fields
    if (selectedUser === "Students" || selectedUser === "Faculties") {
      finalData.course = facultySmart.course || [];
      finalData.division = facultySmart.division || [];
      finalData.semester = facultySmart.semester || [];
      finalData.subject = facultySmart.subject || [];
    }

    const res = await handleAddUser(selectedUser, userAPI, finalData);
    if (res.success) {
      alert(`${selectedUser} added successfully`);
      setUserDetails({});
      setFacultySmart({});
    } else alert(res.message);
  };

  // 📂 Excel upload handler
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

      let success = 0;
      let failed = [];

      for (let i = 0; i < rows.length; i++) {
        const cleanRow = Object.fromEntries(
          Object.entries(rows[i]).map(([k, v]) => [k.trim().toLowerCase(), v]),
        );
        const result = await handleAddUser(selectedUser, userAPI, cleanRow);
        if (result.success) success++;
        else failed.push({ row: i + 2, reason: result.message });
      }

      setUploadSummary({ total: rows.length, success, failed });
      setUploading(false);
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  // 📂 Preview headers
  const getPreviewHeaders = () =>
    userDataBaseEntry[selectedUser]?.map((f) => f.field) || [];
  const getPreviewRow = () => {
    const row = {};
    (userDataBaseEntry[selectedUser] || []).forEach((f) => {
      row[f.field] = "example";
    });
    return row;
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-3xl text-center font-bold mb-6 text-white">
        Add Users
      </h2>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {userToAdd.map((u) => (
          <button
            key={u}
            className={`px-4 py-2 rounded-full font-semibold text-white shadow-lg ${
              selectedUser === u
                ? "bg-blue-500"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => {
              setSelectedUser(u);
              setUserAPI(u.toLowerCase().replace(" ", "-"));
              setUserDetails({});
              setFacultySmart({});
              setUploadSummary(null);
            }}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4">
        {/* Common Fields */}
        {userDataBaseEntry[selectedUser]?.map((field, idx) => (
          <input
            key={idx}
            type={field.type}
            placeholder={field.field}
            name={field.field}
            value={userDetails[field.field] || ""}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
          />
        ))}

        {/* Students/Faculties Multi-select */}
        {(selectedUser === "Students" || selectedUser === "Faculties") && (
          <>
            {/* Course */}
            <label>Course(s)</label>
            <select
              multiple
              name="course"
              value={facultySmart.course || []}
              onChange={handleMultiSelect}
              className="border rounded w-full p-2 min-h-[80px]"
            >
              {Object.keys(COURSE_SUBJECT_MAP).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Division */}
            <label>Division(s)</label>
            <select
              multiple
              name="division"
              value={facultySmart.division || []}
              onChange={handleMultiSelect}
              className="border rounded w-full p-2 min-h-[60px]"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Semester */}
            <label>Semester(s)</label>
            <select
              multiple
              name="semester"
              value={facultySmart.semester || []}
              onChange={handleMultiSelect}
              className="border rounded w-full p-2 min-h-[60px]"
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>

            {/* Subject */}
            <label>Subject(s)</label>
            <select
              multiple
              name="subject"
              value={facultySmart.subject || []}
              onChange={handleMultiSelect}
              disabled={!areSubjectsEnabled}
              className={`border rounded w-full p-2 min-h-[80px] ${
                !areSubjectsEnabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              {allowedSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            {!areSubjectsEnabled && (
              <p className="text-gray-500 text-sm">
                Select course(s) first to enable subjects
              </p>
            )}
          </>
        )}

        <button
          onClick={handleSingleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          Add {selectedUser}
        </button>

        {/* Excel Upload */}
        <div>
          <label className="font-semibold">Upload Excel:</label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="border p-2 rounded w-full"
          />
          {uploading && <p className="text-blue-600 mt-2">⏳ Uploading...</p>}
          {uploadSummary && (
            <div className="mt-2 border p-2 rounded">
              <p>Success: {uploadSummary.success}</p>
              <p>Failed: {uploadSummary.failed.length}</p>
              {uploadSummary.failed.length > 0 && (
                <ul className="text-red-600 ml-4 list-disc">
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

        {/* Excel Preview */}
        {userDataBaseEntry[selectedUser] && (
          <div className="mt-4 border p-2 rounded bg-gray-50">
            <p className="font-semibold">Excel Format Preview</p>
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  {getPreviewHeaders().map((h) => (
                    <th key={h} className="border px-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.values(getPreviewRow()).map((val, i) => (
                    <td key={i} className="border px-2 text-gray-500">
                      {val}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddUsers;
