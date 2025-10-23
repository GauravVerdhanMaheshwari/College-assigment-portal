import React from "react";
import { UserProfile } from "../../components/index";
import { useNavigate } from "react-router-dom";

function StudentProfile() {
  document.title = "Student Profile";
  const navigate = useNavigate();
  const userDetails = JSON.parse(sessionStorage.getItem("user")).student;

  const handleSave = (updatedUser) => {
    console.log("Saved student profile:", updatedUser);
    alert("Profile saved (UI only)!");
  };

  const theme = {
    bgGradient: "from-[#FBD785FF] to-[#FFBC1FFF]",
    textColor: "#FBFBFBFF",
    buttonColor: "#00BFFFFF",
    buttonHoverColor: "#008DBCFF",
    buttonShadow: "4px 4px 16px 1px rgba(15,121,156,0.4)",
    textShadow: "0 0 10px rgba(7,59,76,0.5)",
  };

  return (
    <div className={`p-6 min-h-screen bg-gradient-to-b ${theme.bgGradient}`}>
      <button
        onClick={() => navigate("/student")}
        className="mb-6 px-5 py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg"
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

      <UserProfile
        userDetails={userDetails}
        onSave={handleSave}
        theme={theme}
      />
    </div>
  );
}

export default StudentProfile;
