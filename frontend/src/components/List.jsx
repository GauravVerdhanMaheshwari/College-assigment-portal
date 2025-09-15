import React, { useState, useEffect } from "react";

function List() {
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState("students");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/${fetchingUsers}`);
        const data = await response.json();
        console.log(data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [fetchingUsers, setFetchingUsers]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center">User List</h2>
      <div>
        <div className="flex justify-center my-5 gap-6">
          <button
            className={`px-6 py-2 rounded-full font-semibold text-white transition-all duration-500 ease-in-out ${
              fetchingUsers === "students"
                ? "bg-[#38BDF8] hover:bg-[#0A9FE0FF] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)]"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => setFetchingUsers("students")}
          >
            Students
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold text-white transition-all duration-500 ease-in-out ${
              fetchingUsers === "faculties"
                ? "bg-[#38BDF8] hover:bg-[#0A9FE0FF] hover:shadow-[4px_4px_16px_1px_rgba(15,121,156,0.4)] "
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => setFetchingUsers("faculties")}
          >
            Faculties
          </button>
        </div>

        <ul className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md bg-white mx-20 mb-10">
          <table className="min-w-full border-collapse border-none">
            <thead className="sticky top-0 bg-white">
              <tr className="border-none">
                {fetchingUsers === "faculties" ? (
                  <>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Subject</th>
                    <th className="px-4 py-2 border">Course</th>
                    <th className="px-4 py-2 border">Year</th>
                    <th className="px-4 py-2 border">Division</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2 border">Enrollment No</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Course</th>
                    <th className="px-4 py-2 border">Division</th>
                    <th className="px-4 py-2 border">Year</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {fetchingUsers === "faculties" &&
                users.map((user) => (
                  <tr
                    key={user._id}
                    className=" transition-all duration-500 ease-in-out hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.subject}</td>
                    <td className="px-4 py-2 border">{user.course}</td>
                    <td className="px-4 py-2 border">{user.year}</td>
                    <td className="px-4 py-2 border">{user.division}</td>
                  </tr>
                ))}
              {fetchingUsers === "students" &&
                users.map((user) => (
                  <tr
                    key={user._id}
                    className=" transition-all duration-500 ease-in-out hover:bg-gray-100"
                  >
                    <td className="px-4 py-2 border">
                      {user.enrollmentNumber}
                    </td>
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.course}</td>
                    <td className="px-4 py-2 border">{user.division}</td>
                    <td className="px-4 py-2 border">{user.year}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </ul>
      </div>
    </div>
  );
}

export default List;
