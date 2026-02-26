import React, { useMemo, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { COURSE_SEM_SUBJECT_MAP, DIVISIONS, SEMESTERS } from "./courseMap";

/* =========================================================
   ULTRA ENTERPRISE ADD USERS (RBAC ENABLED)
========================================================= */

function AddUsers({
  currentUserRole = "Admin",
  userToAdd = [],
  userDataBaseEntry = {},
  selectOptions = {},
  handleAddUser,
}) {
  /* ================= ROLE PERMISSIONS ================= */

  const ROLE_ACCESS = {
    Admin: ["Library Managers", "User Managers", "Students", "Faculties"],
    "User Manager": ["Students", "Faculties"],
    "Library Manager": [], // change if needed
  };

  const allowedUserTypes = useMemo(() => {
    const allowed = ROLE_ACCESS[currentUserRole] || [];
    return userToAdd.filter((u) => allowed.includes(u));
  }, [userToAdd, currentUserRole]);

  const [selectedUserType, setSelectedUserType] = useState(
    allowedUserTypes[0] || "",
  );

  const [formData, setFormData] = useState({});
  const [excelErrors, setExcelErrors] = useState([]);
  const [excelSuccess, setExcelSuccess] = useState(0);

  /* keep selected type valid */
  useEffect(() => {
    if (!allowedUserTypes.includes(selectedUserType)) {
      setSelectedUserType(allowedUserTypes[0] || "");
    }
  }, [allowedUserTypes]);

  /* ================= HELPERS ================= */

  const isFaculty = selectedUserType === "Faculties";
  const isStudent = selectedUserType === "Students";

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= ACADEMIC YEAR ================= */

  const isValidAcademicYear = (val) => {
    if (!val) return false;
    const ok = /^\d{4}-\d{2}$/.test(val);
    if (!ok) return false;

    const [start, end] = val.split("-");
    return Number(end) === (Number(start) + 1) % 100;
  };

  /* ================= SUBJECT INFERENCE ================= */

  const dynamicSubjects = useMemo(() => {
    const courses = Array.isArray(formData.course)
      ? formData.course
      : formData.course
        ? [formData.course]
        : [];

    const semesters = Array.isArray(formData.semesters)
      ? formData.semesters
      : formData.semesters
        ? [formData.semesters]
        : [];

    if (!courses.length || !semesters.length) return [];

    const subjectSet = new Set();

    courses.forEach((course) => {
      semesters.forEach((sem) => {
        const subs = COURSE_SEM_SUBJECT_MAP?.[course]?.[Number(sem)] || [];
        subs.forEach((s) => subjectSet.add(s));
      });
    });

    return Array.from(subjectSet);
  }, [formData.course, formData.semesters]);

  /* auto-clean invalid subjects */
  useEffect(() => {
    if (!isFaculty) return;
    if (!formData.subject) return;

    setFormData((prev) => ({
      ...prev,
      subject: (prev.subject || []).filter((s) => dynamicSubjects.includes(s)),
    }));
  }, [dynamicSubjects]);

  /* ================= FIELD RENDER ================= */

  const renderField = ({ field, type }) => {
    /* SUBJECT */
    if (field === "subject") {
      return (
        <select
          multiple={isFaculty}
          value={formData[field] || (isFaculty ? [] : "")}
          onChange={(e) =>
            handleChange(
              field,
              isFaculty
                ? Array.from(e.target.selectedOptions, (o) => o.value)
                : e.target.value,
            )
          }
          className="input"
        >
          {dynamicSubjects.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      );
    }

    /* SELECTS */

    const isMulti = type === "multiselect" && isFaculty;

    if (
      type === "multiselect" ||
      field === "course" ||
      field === "division" ||
      field === "semesters"
    ) {
      const options =
        field === "course"
          ? Object.keys(COURSE_SEM_SUBJECT_MAP)
          : field === "division"
            ? DIVISIONS
            : field === "semesters"
              ? SEMESTERS
              : selectOptions[field] || [];

      return (
        <select
          multiple={isMulti}
          value={formData[field] || (isMulti ? [] : "")}
          onChange={(e) =>
            handleChange(
              field,
              isMulti
                ? Array.from(e.target.selectedOptions, (o) => o.value)
                : e.target.value,
            )
          }
          className="input"
        >
          {!isMulti && <option value="">Select {field}</option>}
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    /* INPUT */

    return (
      <input
        type={type === "string" ? "text" : type}
        value={formData[field] || ""}
        placeholder={field === "yearOfJoining" ? "e.g. 2021-22" : field}
        onChange={(e) => handleChange(field, e.target.value)}
        className="input"
      />
    );
  };

  /* =========================================================
     🔥 EXCEL TEMPLATE (DYNAMIC PER ROLE)
  ========================================================= */

  const currentSchema = userDataBaseEntry[selectedUserType] || [];

  const excelHeaders = useMemo(
    () => currentSchema.map((f) => f.field),
    [currentSchema],
  );

  const sampleRow = useMemo(() => {
    const row = {};

    currentSchema.forEach(({ field }) => {
      switch (field) {
        case "enrollmentNumber":
          row[field] = 220101;
          break;
        case "name":
          row[field] = "Rahul Sharma";
          break;
        case "email":
          row[field] = "rahul@gmail.com";
          break;
        case "yearOfJoining":
          row[field] = "2022-23";
          break;
        case "course":
          row[field] = "IT";
          break;
        case "division":
          row[field] = "A";
          break;
        case "semesters":
          row[field] = "3";
          break;
        case "subject":
          row[field] = "DBMS";
          break;
        default:
          row[field] = "Sample";
      }
    });

    return row;
  }, [currentSchema]);

  const downloadExcelTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([sampleRow], {
      header: excelHeaders,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, selectedUserType);

    XLSX.writeFile(
      workbook,
      `${selectedUserType.replace(/\s/g, "_")}_Template.xlsx`,
    );
  };

  /* ================= EXCEL IMPORT ================= */

  const normalizeRow = (row) => {
    const r = {};
    Object.entries(row).forEach(([k, v]) => {
      r[k.trim().toLowerCase()] = v;
    });
    return r;
  };

  const validateRow = (row, index) => {
    const errors = [];

    if (!row.name) errors.push("Missing name");
    if (!row.email) errors.push("Missing email");

    if (isStudent) {
      if (!isValidAcademicYear(String(row.yearofjoining))) {
        errors.push("Invalid yearOfJoining (use 2021-22)");
      }
    }

    return errors.length ? { row: index + 2, errors } : null;
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelErrors([]);
    setExcelSuccess(0);

    const reader = new FileReader();

    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const errors = [];
      let success = 0;

      data.forEach((rawRow, idx) => {
        const row = normalizeRow(rawRow);
        const err = validateRow(row, idx);

        if (err) errors.push(err);
        else {
          success++;
          handleAddUser?.(selectedUserType, row);
        }
      });

      setExcelErrors(errors);
      setExcelSuccess(success);
    };

    reader.readAsBinaryString(file);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!allowedUserTypes.includes(selectedUserType)) {
      alert("You are not allowed to add this user type");
      return;
    }

    if (isStudent) {
      if (!isValidAcademicYear(formData.yearOfJoining)) {
        alert("Year of Joining must be like 2021-22");
        return;
      }
    }

    handleAddUser?.(selectedUserType, formData);
    setFormData({});
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Users</h2>

      {/* USER TYPE */}
      <select
        value={selectedUserType}
        onChange={(e) => setSelectedUserType(e.target.value)}
        className="input mb-4"
      >
        {allowedUserTypes.map((u) => (
          <option key={u}>{u}</option>
        ))}
      </select>

      {/* EXCEL */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <p className="font-semibold">Bulk Upload (Excel)</p>

          <button
            onClick={downloadExcelTemplate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ⬇ Download Template
          </button>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleExcelUpload}
          className="mt-3"
        />

        {excelSuccess > 0 && (
          <p className="text-green-600 mt-2">✅ Added: {excelSuccess}</p>
        )}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        {(userDataBaseEntry[selectedUserType] || []).map((f) => (
          <div key={f.field}>
            <label className="label">{f.field}</label>
            {renderField(f)}
          </div>
        ))}

        <button className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
          Add {selectedUserType}
        </button>
      </form>

      {/* ERRORS */}
      {excelErrors.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-300 p-4 rounded-xl">
          <h4 className="font-semibold text-red-700 mb-2">Excel Errors</h4>
          {excelErrors.map((e, i) => (
            <div key={i} className="text-sm text-red-600">
              Row {e.row}: {e.errors.join(", ")}
            </div>
          ))}
        </div>
      )}

      {/* styles */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          padding: 8px 10px;
          border-radius: 10px;
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.15);
        }
        .label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          display: block;
          margin-bottom: 4px;
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
}

export default AddUsers;
