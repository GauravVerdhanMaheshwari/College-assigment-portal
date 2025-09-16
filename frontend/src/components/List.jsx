import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEntity]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${activeEntity}`);
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
      setIsGrouped(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const entityIndex = entityEndpoints.indexOf(activeEntity);

  // helper to remove ids from local state (works for grouped or flat filteredUsers)
  const removeUsersFromState = (deletedIds) => {
    setUsers((prev) => prev.filter((u) => !deletedIds.includes(u._id)));

    setFilteredUsers((prev) => {
      // grouped -> object of arrays
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
      // flat -> array
      if (Array.isArray(prev)) {
        return prev.filter((u) => !deletedIds.includes(u._id));
      }
      return prev;
    });
  };

  // single delete (with confirm)
  const handleSingleDelete = async (user) => {
    const name = user.name || user._id;
    const ok = window.confirm(`Delete ${name}? This action cannot be undone.`);
    if (!ok) return;

    if (!handleDelete) {
      removeUsersFromState([user._id]);
      return;
    }

    try {
      await handleDelete(user, activeEntity);
      removeUsersFromState([user._id]);
    } catch (err) {
      console.error(err);
      alert(`Error deleting ${name}. See console for details.`);
    }
  };

  // group delete (with confirm, waits for all deletes)
  const handleDeleteGroup = async (items, groupName) => {
    const ok = window.confirm(
      `Delete ${items.length} item(s) in group "${groupName}"? This action cannot be undone.`
    );
    if (!ok) return;

    const ids = items.map((u) => u._id);

    if (!handleDelete) {
      removeUsersFromState(ids);
      return;
    }

    try {
      // wait for all delete requests
      await Promise.all(items.map((u) => handleDelete(u, activeEntity)));
      removeUsersFromState(ids);
    } catch (err) {
      console.error(err);
      alert(
        `Error deleting group "${groupName}". Some items may not have been deleted.`
      );
    }
  };

  const handleSaveEdit = async (updatedUser) => {
    if (!updatedUser) return;

    try {
      const serverData = await handleEdit(updatedUser, activeEntity);
      const finalUser = serverData && serverData._id ? serverData : updatedUser;

      // update state with final data
      setUsers((prev) =>
        prev.map((u) => (u._id === finalUser._id ? finalUser : u))
      );

      setFilteredUsers((prev) => {
        if (
          isGrouped &&
          prev &&
          typeof prev === "object" &&
          !Array.isArray(prev)
        ) {
          const newObj = {};
          Object.entries(prev).forEach(([grp, items]) => {
            newObj[grp] = items.map((u) =>
              u._id === finalUser._id ? finalUser : u
            );
          });
          return newObj;
        }
        if (Array.isArray(prev)) {
          return prev.map((u) => (u._id === finalUser._id ? finalUser : u));
        }
        return prev;
      });

      setEditingUser(null);
    } catch (err) {
      console.error(err);
      alert(`Error saving changes. See console for details.`);
    }
  };

  // row action buttons (use local handlers to add confirm & state updates)
  const ActionButtons = ({ user }) => (
    <div className="flex gap-2">
      <button
        onClick={() => setEditingUser({ ...user })}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-all duration-200"
      >
        Edit
      </button>
      <button
        onClick={() => handleSingleDelete(user)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-200"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-white text-shadow-[0px_0px_10px_rgba(255,255,255,0.8)]">
        User List
      </h2>

      {/* Switch buttons */}
      <div className="flex justify-center my-5 gap-6">
        {entityNames.map((name, index) => (
          <button
            key={name}
            className={`px-6 py-2 rounded-full font-semibold text-white transition-all shadow-xl hover:shadow-lg duration-300 ${
              activeEntity === entityEndpoints[index]
                ? "bg-[#38BDF8] hover:bg-[#0A9FE0FF]"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => setActiveEntity(entityEndpoints[index])}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Filter */}
      <Filter
        data={users}
        entityFields={entityFields[entityIndex]}
        entityKeys={entityKeys[entityIndex]}
        onFilter={(result, grouped) => {
          setFilteredUsers(result);
          setIsGrouped(grouped);
        }}
      />

      {/* Table */}
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md bg-white mx-20 mb-10">
        {isGrouped ? (
          // grouped mode: filteredUsers is an object { groupName: [items] }
          Object.entries(filteredUsers).map(([group, items]) => (
            <div key={group} className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{group}</h3>
                <button
                  onClick={() => handleDeleteGroup(items, group)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all duration-200"
                >
                  Delete Group
                </button>
              </div>

              <table className="min-w-full border-collapse border-none mb-4">
                <thead className="sticky top-0 bg-gray-100">
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
                  {items.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      {entityKeys[entityIndex].map((key) => (
                        <td key={key} className="px-4 py-2 border">
                          {editingUser && editingUser._id === user._id ? (
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
                        {editingUser && editingUser._id === user._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(editingUser)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
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
            </div>
          ))
        ) : (
          // flat list mode
          <table className="min-w-full border-collapse border-none">
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
              {Array.isArray(filteredUsers) &&
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-100 transition-all duration-200"
                  >
                    {entityKeys[entityIndex].map((key) => (
                      <td key={key} className="px-4 py-2 border">
                        {editingUser && editingUser._id === user._id ? (
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
                      {editingUser && editingUser._id === user._id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(editingUser)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
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
        )}
      </div>
    </div>
  );
}

export default List;
