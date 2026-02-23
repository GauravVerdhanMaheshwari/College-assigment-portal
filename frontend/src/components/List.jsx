import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter } from "../components/index";

const formatValue = (val) => {
  if (Array.isArray(val)) return val.join(", ");
  if (val === undefined || val === null || val === "") return "-";
  return val;
};

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
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const entityIndex = useMemo(
    () => entityEndpoints.indexOf(activeEntity),
    [entityEndpoints, activeEntity],
  );

  // ✅ FETCH
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
        setSelectedIds([]);
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
  
  // ✅ FILTER
  const handleFilter = useCallback((result, grouped) => {
    setFilteredUsers(result);
    setIsGrouped(grouped);
    setCurrentPage(1);
    setSelectedIds([]);
  }, []);
  
  // ✅ PAGINATION
  const totalPages = useMemo(() => {
    if (!Array.isArray(filteredUsers)) return 1;
    return Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  }, [filteredUsers]);
  
  const paginatedUsers = useMemo(() => {
    if (!Array.isArray(filteredUsers)) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  // ✅ DELETE
  const handleSingleDelete = async (user) => {
    const ok = window.confirm(`Delete ${user.name}?`);
    if (!ok) return;
    
    await handleDelete(user, activeEntity);
    setUsers((prev) => prev.filter((u) => u._id !== user._id));
    setFilteredUsers((prev) =>
      Array.isArray(prev) ? prev.filter((u) => u._id !== user._id) : prev,
  );
};

// ✅ SAVE EDIT
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

return (
  <div>
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        User Management
      </h2>

      {/* SWITCH */}
      <div className="flex justify-center my-5 gap-6">
        {entityNames.map((name, index) => (
          <button
            key={name}
            className={`px-6 py-2 rounded-full font-semibold text-white shadow-lg ${
              activeEntity === entityEndpoints[index]
                ? "bg-sky-500"
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
                    {entityKeys[entityIndex].map((key) => (
                      <td key={key} className="px-4 py-2 border">
                        {editingUser?._id === user._id ? (
                          <input
                            value={editingUser[key] ?? ""}
                            onChange={(e) =>
                              setEditingUser({
                                ...editingUser,
                                [key]: e.target.value,
                              })
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        ) : (
                          formatValue(user[key])
                        )}
                      </td>
                    ))}

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

        {/* PAGINATION */}
        {!isGrouped && (
          <div className="flex justify-center gap-2 py-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-sky-500 text-white"
                    : "bg-gray-200"
                }`}
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
