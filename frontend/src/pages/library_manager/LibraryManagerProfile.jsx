import React from "react";
import { UserProfile } from "../../components/index";
import { useNavigate } from "react-router-dom";

function LibraryManagerProfile() {
  document.title = "Library Manager Profile";
  const navigate = useNavigate();
  const userDetails = JSON.parse(sessionStorage.getItem("user")).libraryManager;

  const handleSave = (updatedUser) => {
    console.log("Saved library manager data:", updatedUser);
    alert("Profile saved (UI only)!");
  };

  // Theme/colors for child component
  const theme = {
    bgGradient: "from-[#38BDF8] to-[#8B5CF6]",
    textColor: "#1E3A8A",
    buttonColor: "#6EE7B7",
    buttonHoverColor: "#5CC198FF",
    buttonShadow: "4px 4px 16px 1px rgba(7,59,76,0.4)", // hover shadow style
    textShadow: "0 0 10px rgba(30,58,138,0.5)",
  };

  return (
    <div className={`p-6 min-h-screen bg-gradient-to-b ${theme.bgGradient}`}>
      {/* Home Button */}
      <button
        onClick={() => navigate("/library-manager-home")}
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

export default LibraryManagerProfile;
