import React, { useState } from "react";
import * as XLSX from "xlsx";

function AddUsers({ userToAdd, userDataBaseEntry, handleAddUser }) {
  const [user, setUser] = useState(userToAdd[0]);
  const [userAPI, setUserAPI] = useState(userToAdd[0].toLowerCase());
  const [userDetails, setUserDetails] = useState({});

  // 📂 Handle Excel Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // take first sheet
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // rows = [{ name: "John", email: "...", division: "A", ... }, {...}]
      rows.forEach((row) => {
        handleAddUser(user, userAPI, row);
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl mb-5 mt-2 font-bold text-center text-white text-shadow-[0px_0px_10px_rgba(255,255,255,0.8)]">
        Add Users
      </h2>
      <div className="p-4 bg-white rounded shadow-md mx-20 mb-10 flex flex-col justify-center items-center">
        {/* Tabs */}
        <div className="mr-10">
          <ul className="flex gap-5">
            {userToAdd.map((user, index) => (
              <button
                className="bg-[#0EA5E9] text-white p-2 rounded hover:bg-[#0B85B1] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                key={index}
                onClick={() => {
                  setUser(user);
                  setUserAPI(user.toLowerCase());
                }}
              >
                {user}
              </button>
            ))}
          </ul>
        </div>

        {/* Manual Form */}
        <div className="w-full max-w-sm flex flex-col my-5 gap-3">
          {userDataBaseEntry[user].map((field, index) => (
            <input
              key={index}
              type={field.type}
              id={field.field}
              name={field.field}
              placeholder={
                field.field.charAt(0).toUpperCase() +
                field.field.slice(1).replace(/([A-Z])/g, " $1")
              }
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              value={userDetails[field.field] || ""}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  [field.field]: e.target.value,
                })
              }
            />
          ))}
        </div>

        {/* Add Single User */}
        <button
          className="bg-[#0EA5E9] text-white px-4 py-2 rounded hover:bg-[#0B85B1] transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          onClick={() => {
            handleAddUser(user, userAPI, userDetails);
            setUserDetails({});
          }}
        >
          Add {user}
        </button>

        {/* Excel Upload */}
        <div className="mt-6 flex flex-col items-center">
          <label className="mb-2 font-semibold text-gray-700">
            Or Upload Excel File:
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="w-full max-w-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
          />
          <p className="text-xs text-gray-500 mt-2">
            Make sure your Excel headers match database fields (e.g.,{" "}
            <code>name</code>, <code>email</code>, <code>division</code>).
          </p>
        </div>
      </div>
    </div>
  );
}

export default AddUsers;
