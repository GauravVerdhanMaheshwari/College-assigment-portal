import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Filter } from "../components/index";
import { COURSE_SEM_SUBJECT_MAP } from "./courseMap";

/* ===================== HELPERS ===================== */

const formatValue = (val) => {
  if (Array.isArray(val)) return val.join(", ");
  if (val === undefined || val === null || val === "") return "-";
  return val;
};

const MULTI_FIELDS = ["course", "division", "subject", "semester"];

const SELECT_OPTIONS = {
  course: ["BCA", "MCA", "IT"],
  division: ["A", "B", "C", "D"],
  semester: [1, 2, 3, 4, 5, 6],
};

/* ================= SUBJECT VALIDATOR ================= */

const getValidSubjects = (courses = [], semesters = []) => {
  const valid = new Set();

  courses.forEach((course) => {
    const semMap = COURSE_SEM_SUBJECT_MAP[course];
    if (!semMap) return;

    semesters.forEach((sem) => {
      const subjects = semMap[sem];
      if (subjects) subjects.forEach((s) => valid.add(s));
    });
  });

  return Array.from(valid);
};

/* ===================== PREMIUM MULTISELECT ===================== */

const PremiumMultiSelect = ({
  value = [],
  options = [],
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef(null);

  /* 🔥 outside click close */
  useEffect(() => {
    const handler = (e) => {
      if (!boxRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    return options.filter((opt) =>
      String(opt).toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const toggle = (val) => {
    if (disabled) return;

    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeChip = (val) => {
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`min-h-[38px] border rounded-xl px-2 py-1 flex flex-wrap gap-1 transition
          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white cursor-pointer hover:border-sky-400"
          }`}
      >
        {value.length === 0 && (
          <span className="text-gray-400 text-sm">
            {disabled ? "Select course & semester first" : "Select..."}
          </span>
        )}

        {value.map((v, i) => (
          <span
            key={i}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow"
          >
            {v}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(v);
                }}
              >
                ✕
              </button>
            )}
          </span>
        ))}
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-2xl shadow-xl p-2">
          <input
            className="w-full mb-2 px-2 py-1 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-44 overflow-y-auto flex flex-wrap gap-1">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 px-2">No options</p>
            )}

            {filtered.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(opt)}
                className={`px-2 py-1 rounded text-sm transition
                  ${
                    value.includes(opt)
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== MAIN COMPONENT ===================== */

function List({
  entityNames,
  entityFields,
  entityKeys,
  entityEndpoints,
  handleDelete,
  handleEdit,
}) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [activeEntity, setActiveEntity] = useState(entityEndpoints[0]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const entityIndex = useMemo(
    () => entityEndpoints.indexOf(activeEntity),
    [entityEndpoints, activeEntity],
  );

  const isFacultyView = activeEntity === "faculties";

  /* ================= FETCH ================= */

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/${activeEntity}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
        setCurrentPage(1);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    return () => controller.abort();
  }, [activeEntity]);

  /* ================= FILTER ================= */

  const handleFilter = useCallback((result, grouped) => {
    setFilteredUsers(result);
    setIsGrouped(grouped);
    setCurrentPage(1);
  }, []);

  /* ================= PAGINATION ================= */

  const totalPages = useMemo(() => {
    if (!Array.isArray(filteredUsers)) return 1;
    return Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  }, [filteredUsers]);

  const paginatedUsers = useMemo(() => {
    if (!Array.isArray(filteredUsers)) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  /* ================= SMART UPDATE ================= */

  const updateEditingUser = (key, val) => {
    setEditingUser((prev) => {
      const updated = { ...prev, [key]: val };

      if (isFacultyView) {
        const courses = updated.course || [];
        const semesters = updated.semester || [];

        const validSubjects = getValidSubjects(courses, semesters);

        updated.subject = (updated.subject || []).filter((s) =>
          validSubjects.includes(s),
        );
      }

      return updated;
    });
  };

  /* ================= DELETE ================= */

  const handleSingleDelete = async (user) => {
    const ok = window.confirm(`Delete ${user.name}?`);
    if (!ok) return;

    await handleDelete(user, activeEntity);

    setUsers((prev) => prev.filter((u) => u._id !== user._id));
    setFilteredUsers((prev) =>
      Array.isArray(prev) ? prev.filter((u) => u._id !== user._id) : prev,
    );
  };

  /* ================= SAVE ================= */

  const handleSaveEdit = async (updatedUser) => {
    const serverData = await handleEdit(updatedUser, activeEntity);
    const finalUser = serverData?._id ? serverData : updatedUser;

    setUsers((prev) =>
      prev.map((u) => (u._id === finalUser._id ? finalUser : u)),
    );

    setFilteredUsers((prev) =>
      Array.isArray(prev)
        ? prev.map((u) => (u._id === finalUser._id ? finalUser : u))
        : prev,
    );

    setEditingUser(null);
  };

  /* ================= RENDER ================= */

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        User Management
      </h2>

      {/* ENTITY SWITCH */}
      <div className="flex justify-center my-5 gap-6 flex-wrap">
        {entityNames.map((name, index) => (
          <button
            key={name}
            className={`px-6 py-2 rounded-full font-semibold text-white shadow-lg transition
              ${
                activeEntity === entityEndpoints[index]
                  ? "bg-gradient-to-r from-sky-500 to-blue-600"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            onClick={() => setActiveEntity(entityEndpoints[index])}
          >
            {name}
          </button>
        ))}
      </div>

      {/* FILTER */}
      <Filter
        data={users}
        entityFields={entityFields[entityIndex]}
        entityKeys={entityKeys[entityIndex]}
        groupableKeys={["subject", "course", "semester", "division"]}
        onFilter={handleFilter}
      />

      {/* TABLE */}
      <div className="mx-20 mb-10 bg-white rounded-2xl shadow-xl border overflow-hidden">
        <div className="max-h-[420px] overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 bg-white">
              <tr>
                {entityFields[entityIndex].map((field) => (
                  <th key={field} className="px-4 py-2 border">
                    {field}
                  </th>
                ))}
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    {entityKeys[entityIndex].map((key) => {
                      const subjectOptions =
                        isFacultyView && key === "subject"
                          ? getValidSubjects(
                              editingUser?.course || [],
                              editingUser?.semester || [],
                            )
                          : SELECT_OPTIONS[key] || [];

                      const subjectDisabled =
                        isFacultyView &&
                        key === "subject" &&
                        (!editingUser?.course?.length ||
                          !editingUser?.semester?.length);

                      return (
                        <td key={key} className="px-4 py-2 border">
                          {editingUser?._id === user._id ? (
                            MULTI_FIELDS.includes(key) ? (
                              <PremiumMultiSelect
                                value={
                                  Array.isArray(editingUser[key])
                                    ? editingUser[key]
                                    : []
                                }
                                options={subjectOptions}
                                disabled={subjectDisabled}
                                onChange={(val) => updateEditingUser(key, val)}
                              />
                            ) : (
                              <input
                                value={editingUser[key] ?? ""}
                                onChange={(e) =>
                                  updateEditingUser(key, e.target.value)
                                }
                                className="border rounded px-2 py-1 w-full"
                              />
                            )
                          ) : (
                            formatValue(user[key])
                          )}
                        </td>
                      );
                    })}

                    <td className="px-4 py-2 border">
                      {editingUser?._id === user._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(editingUser)}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser({ ...user })}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSingleDelete(user)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!isGrouped && (
          <div className="flex justify-center gap-2 py-4 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded transition
                  ${
                    currentPage === i + 1
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
