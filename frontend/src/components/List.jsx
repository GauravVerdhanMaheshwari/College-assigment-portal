import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter } from "../components/index";

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
  const [currentGroupField, setCurrentGroupField] = useState("");

  // 🔥 senior states
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // ✅ memoized entity index
  const entityIndex = useMemo(
    () => entityEndpoints.indexOf(activeEntity),
    [entityEndpoints, activeEntity],
  );

  // ✅ SAFE FETCH (race protected)
  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:3000/${activeEntity}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        setUsers(data);
        setFilteredUsers(data);
        setIsGrouped(false);
        setSelectedIds([]);
        setCurrentPage(1);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching users:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [activeEntity]);

  // ✅ stable filter handler (VERY IMPORTANT)
  const handleFilter = useCallback((result, grouped, groupField) => {
    setFilteredUsers(result);
    setIsGrouped(grouped);
    setCurrentGroupField(groupField || "");
    setCurrentPage(1);
    setSelectedIds([]);
  }, []);

  // ✅ pagination math
  const totalPages = useMemo(() => {
    if (!Array.isArray(filteredUsers)) return 1;
    return Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  }, [filteredUsers]);

  // ✅ clamp page
  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // ✅ paginated data
  const paginatedUsers = useMemo(() => {
    if (!Array.isArray(filteredUsers)) return [];
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  // ✅ selection helper
  const allVisibleSelected = useMemo(() => {
    return (
      paginatedUsers.length > 0 &&
      paginatedUsers.every((u) => selectedIds.includes(u._id))
    );
  }, [paginatedUsers, selectedIds]);

  // helper to remove ids from state
  const removeUsersFromState = useCallback(
    (deletedIds) => {
      setUsers((prev) => prev.filter((u) => !deletedIds.includes(u._id)));

      setFilteredUsers((prev) => {
        if (
          isGrouped &&
          prev &&
          typeof prev === "object" &&
          !Array.isArray(prev)
        ) {
          const newObj = {};
          Object.entries(prev).forEach(([grp, items]) => {
            const remaining = items.filter((u) => !deletedIds.includes(u._id));
            if (remaining.length > 0) newObj[grp] = remaining;
          });
          return newObj;
        }

        if (Array.isArray(prev)) {
          return prev.filter((u) => !deletedIds.includes(u._id));
        }

        return prev;
      });
    },
    [isGrouped],
  );

  const handleDeleteGroup = async (groupKey, items) => {
    const ok = window.confirm(
      `Delete all records in "${groupKey}"? This cannot be undone.`,
    );
    if (!ok) return;

    try {
      await Promise.all(items.map((u) => handleDelete?.(u, activeEntity)));

      const ids = items.map((i) => i._id);
      removeUsersFromState(ids);
    } catch (err) {
      console.error(err);
      alert("Failed to delete group");
    }
  };

  // ✅ single delete
  const handleSingleDelete = useCallback(
    async (user) => {
      const ok = window.confirm(
        `Delete ${user.name || user._id}? This action cannot be undone.`,
      );
      if (!ok) return;

      try {
        await handleDelete?.(user, activeEntity);
        removeUsersFromState([user._id]);
        setSelectedIds((prev) => prev.filter((id) => id !== user._id));
      } catch (err) {
        console.error(err);
        alert("Error deleting item.");
      }
    },
    [activeEntity, handleDelete, removeUsersFromState],
  );

  // ✅ bulk delete
  const handleBulkDelete = useCallback(async () => {
    const ok = window.confirm(`Delete ${selectedIds.length} selected items?`);
    if (!ok) return;

    try {
      const toDelete = users.filter((u) => selectedIds.includes(u._id));
      await Promise.all(toDelete.map((u) => handleDelete?.(u, activeEntity)));
      removeUsersFromState(selectedIds);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed.");
    }
  }, [selectedIds, users, handleDelete, activeEntity, removeUsersFromState]);

  // ✅ save edit
  const handleSaveEdit = useCallback(
    async (updatedUser) => {
      try {
        const serverData = await handleEdit(updatedUser, activeEntity);
        const finalUser = serverData?._id ? serverData : updatedUser;

        setUsers((prev) =>
          prev.map((u) => (u._id === finalUser._id ? finalUser : u)),
        );

        setFilteredUsers((prev) => {
          if (Array.isArray(prev)) {
            return prev.map((u) => (u._id === finalUser._id ? finalUser : u));
          }
          return prev;
        });

        setEditingUser(null);
      } catch (err) {
        console.error(err);
        alert("Error saving changes.");
      }
    },
    [activeEntity, handleEdit],
  );

  const ActionButtons = ({ user }) => (
    <div className="flex gap-2">
      <button
        onClick={() => setEditingUser({ ...user })}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Edit
      </button>
      <button
        onClick={() => handleSingleDelete(user)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent">
        User Management
      </h2>

      {/* entity switch */}
      <div className="flex justify-center my-5 gap-6">
        {entityNames.map((name, index) => (
          <button
            key={name}
            className={`px-6 py-2 rounded-full font-semibold text-white transition-all shadow-xl ${
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

      {/* filter */}
      <Filter
        data={users}
        entityFields={entityFields[entityIndex]}
        entityKeys={entityKeys[entityIndex]}
        groupableKeys={["subject", "course", "semester", "division"]}
        onFilter={handleFilter}
      />

      {/* bulk bar */}
      {!isGrouped && (
        <div className="flex justify-between items-center mx-6 lg:mx-20 mb-3">
          <p className="text-sm text-gray-500">
            {Array.isArray(filteredUsers) ? filteredUsers.length : 0} records
          </p>

          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-sm"
            >
              Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      )}

      {/* table */}
      <div className="mx-20 mb-10 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="max-h-[420px] overflow-y-auto">
          {!isGrouped ? (
            <table className="min-w-full">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [
                            ...new Set([
                              ...prev,
                              ...paginatedUsers.map((u) => u._id),
                            ]),
                          ]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter(
                              (id) => !paginatedUsers.some((u) => u._id === id),
                            ),
                          );
                        }
                      }}
                    />
                  </th>

                  {entityFields[entityIndex].map((field) => (
                    <th key={field} className="px-4 py-2 border">
                      {field}
                    </th>
                  ))}

                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center py-6 text-gray-500"
                    >
                      Loading data...
                    </td>
                  </tr>
                )}

                {!loading && paginatedUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan="100%"
                      className="text-center py-6 text-gray-400"
                    >
                      No records found
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginatedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [...prev, user._id]);
                            } else {
                              setSelectedIds((prev) =>
                                prev.filter((id) => id !== user._id),
                              );
                            }
                          }}
                        />
                      </td>

                      {entityKeys[entityIndex].map((key) => (
                        <td key={key} className="px-4 py-2 border">
                          {editingUser?._id === user._id ? (
                            <input
                              type="text"
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
                            user[key]
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
                          <ActionButtons user={user} />
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            /* ✅ GROUPED VIEW */
            <div className="p-4 space-y-6">
              {Object.entries(filteredUsers).map(([group, items]) => (
                <div key={group}>
                  <div className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded mb-2">
                    <h3 className="text-lg font-bold">
                      {group} ({items.length})
                    </h3>

                    <button
                      onClick={() => handleDeleteGroup(group, items)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Delete Group
                    </button>
                  </div>

                  <table className="min-w-full border mb-4">
                    <tbody>
                      {items.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-100">
                          {entityKeys[entityIndex].map((key) => (
                            <td key={key} className="px-4 py-2 border">
                              {user[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ pagination OUTSIDE scroll */}
        {!isGrouped && Array.isArray(filteredUsers) && (
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
