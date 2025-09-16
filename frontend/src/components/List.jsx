import React, { useState, useEffect } from "react";
import { Filter } from "../components/index";

function List({ entityNames, entityFields, entityKeys, entityEndpoints }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [activeEntity, setActiveEntity] = useState(entityEndpoints[0]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${activeEntity}`);
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // initially same
        setIsGrouped(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [activeEntity]);

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

      {/* 🔎 Filter + Search + Group */}
      <Filter
        data={users}
        entityFields={entityFields[entityIndex]}
        entityKeys={entityKeys[entityIndex]}
        onFilter={(result, grouped) => {
          setFilteredUsers(result);
          setIsGrouped(grouped);
        }}
      />

      {/* 📋 Table */}
      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md bg-white mx-20 mb-10">
        {isGrouped ? (
          // 📂 Grouped mode
          Object.entries(filteredUsers).map(([group, items]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{group}</h3>
              <table className="min-w-full border-collapse border-none mb-4">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    {entityFields[entityIndex].map((field) => (
                      <th key={field} className="px-4 py-2 border">
                        {field}
                      </th>
                    ))}
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
                          {user[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          // Normal flat list
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
              {filteredUsers.map((user) => (
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
        )}
      </div>
    </div>
  );
}

export default List;
