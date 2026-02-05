import React from "react";
import { UserProfile } from "../../components/index";
import { useNavigate } from "react-router-dom";

function UserManagerProfile() {
  document.title = "User Manager Profile";
  const navigate = useNavigate();
  const userDetails = JSON.parse(sessionStorage.getItem("user")).userManager;

  const handleSave = (updatedUser) => {
    fetch("http://localhost:3000/userManagers/" + updatedUser._id, {
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
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        // alert("Profile saved successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to update profile.");
      });
  };

  // Theme/colors for child component
  const theme = {
    bgGradient: "from-[#C4B5FD] to-[#8B5CF6]",
    textColor: "#0EA5E9",
    buttonColor: "#0EA5E9",
    buttonHoverColor: "#0B8DC9",
  };

  return (
    <div className={`p-6 min-h-screen bg-gradient-to-b ${theme.bgGradient}`}>
      {/* Home Button */}
      <button
        onClick={() => navigate("/userManager")}
        className={`mb-6 px-5 py-3 rounded-2xl text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer`}
        style={{
          backgroundColor: theme.buttonColor,
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = theme.buttonHoverColor)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = theme.buttonColor)
        }
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

export default UserManagerProfile;
