import React from "react";
import { UserProfile } from "../../components/index";
import { useNavigate } from "react-router-dom";

function FacultiesProfile() {
  document.title = "Faculties Profile";
  const navigate = useNavigate();
  const userDetails = JSON.parse(sessionStorage.getItem("user")).faculty;

  const handleSave = (updatedUser) => {
    fetch("http://localhost:3000/faculties/" + updatedUser._id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userDetails._id, ...updatedUser }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        alert("Profile saved successfully!");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  // Theme/colors for child component
  const theme = {
    bgGradient: "from-[#A38CFCFF] to-[#8B5CF6]",
    textColor: "#FDF33CFF",
    buttonColor: "#4C1D95",
    buttonHoverColor: "#4C1D95B3", // #4C1D95 at 70% opacity
    buttonShadow: "4px 4px 16px 1px rgba(97,41,186,0.4)",
    textShadow: "0px 0px 10px rgba(124,58,237,0.9)",
  };

  return (
    <div className={`p-6 min-h-screen bg-gradient-to-b ${theme.bgGradient}`}>
      {/* Home Button */}
      <button
        onClick={() => navigate("/faculties")}
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

export default FacultiesProfile;
