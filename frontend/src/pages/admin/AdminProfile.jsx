import React from "react";
import { UserProfile } from "../../components/index";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  document.title = "Admin Profile";
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user")).admin;

  const handleSave = (updatedUser) => {
    fetch("http://localhost:3000/admins/" + updatedUser._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user._id, ...updatedUser }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // alert("Profile saved successfully!");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  // Theme/colors for child component
  const theme = {
    bgGradient: "from-[#A7F3D0] to-[#34D399]",
    textColor: "#FFFFFFFF",
    buttonColor: "#3B96FFFF",
    buttonHoverColor: "#55A3FCFF",
    buttonShadow: "4px 4px 16px 1px rgba(7,59,76,0.4)", // hover shadow style
    textShadow: "0 0 10px rgba(30,58,138,0.5)",
  };

  if (user === null || user.role !== "admin") {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className={`p-6 min-h-screen bg-gradient-to-b ${theme.bgGradient}`}>
      {/* Home Button */}
      <button
        onClick={() => navigate("/admin")}
        className={`mb-6 px-5 py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg cursor-pointer`}
        style={{
          backgroundColor: theme.buttonColor,
          color: theme.textColor,
          textShadow: theme.textShadow,
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = theme.buttonHoverColor;
          e.currentTarget.style.boxShadow = theme.buttonShadow;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = theme.buttonColor;
          e.currentTarget.style.boxShadow = "";
        }}
      >
        ← Home
      </button>

      {/* Profile Component */}
      <UserProfile userDetails={user} onSave={handleSave} theme={theme} />
    </div>
  );
}

export default AdminProfile;
