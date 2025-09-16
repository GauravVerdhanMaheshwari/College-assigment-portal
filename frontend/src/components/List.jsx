import React, { useState, useEffect } from "react";

function List({ entityNames, entityFields, entityKeys, entityEndpoints }) {
  const [users, setUsers] = useState([]);
  const [activeEntity, setActiveEntity] = useState(entityEndpoints[0]); // default students

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${activeEntity}`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [activeEntity]);

  // find which entity is active
  const entityIndex = entityEndpoints.indexOf(activeEntity);

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
                ? "bg-[#38BDF8] hover:bg-[#0A9FE0FF] "
                : "bg-gray-400 hover:bg-gray-500 "
            }`}
            onClick={() => setActiveEntity(entityEndpoints[index])}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md bg-white mx-20 mb-10">
        <table className="min-w-full border-collapse border-none">
          <thead className="sticky top-0 bg-white">
            <tr>
              {entityFields[entityIndex].map((field) => (
                <th key={field} className="px-4 py-2 border">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-100 transition-all duration-200"
              >
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
    </div>
  );
}

export default List;
