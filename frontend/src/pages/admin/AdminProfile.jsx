import React from "react";
import { UserProfile } from "../../components/index";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  document.title = "Admin Profile";
  const navigate = useNavigate();
  const userDetails = JSON.parse(sessionStorage.getItem("user")).admin;

  const handleSave = (updatedUser) => {
    console.log("Saved admin data:", updatedUser);
    alert("Profile saved (UI only)!");
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

  return (
    <div className={`p-6 min-h-screen bg-gradient-to-b ${theme.bgGradient}`}>
      {/* Home Button */}
      <button
        onClick={() => navigate("/admin-home")}
        className={`mb-6 px-5 py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg`}
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
      <UserProfile
        userDetails={userDetails}
        onSave={handleSave}
        theme={theme}
      />
    </div>
  );
}

export default AdminProfile;
