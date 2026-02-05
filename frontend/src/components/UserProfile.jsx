import React, { useEffect, useState } from "react";

function UserProfile({ userDetails, onSave, theme }) {
  const [user, setUser] = useState(userDetails);
  const [showPassword, setShowPassword] = useState(false);

  const [showNameError, setShowNameError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const errorCSS = "pl-2 pt-2 text-red-400 text-lg";

  /* Sync state if userDetails prop changes */
  useEffect(() => {
    setUser(userDetails);
  }, [userDetails]);

  /* Hide success message when user edits again */
  useEffect(() => {
    setShowSuccess(false);
  }, [user.name, user.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: name === "password" ? value : value.trim(),
    }));
  };

  const checkChanges = ({ name, password }) => {
    let isValid = true;

    if (!name) {
      setNameErrorMessage("Error: Enter a name");
      setShowNameError(true);
      isValid = false;
    } else {
      setShowNameError(false);
    }

    if (!password) {
      setPasswordErrorMessage("Error: Enter a password");
      setShowPasswordError(true);
      isValid = false;
    } else {
      setShowPasswordError(false);
    }

    return isValid;
  };

  const handleSave = () => {
    if (!onSave) return;

    const isValid = checkChanges(user);

    if (isValid) {
      setShowSuccess(true);
      onSave(user);
    } else {
      setShowSuccess(false);
    }
  };

  return (
    <div
      className="max-w-xl mx-auto p-8 rounded-2xl shadow-[0_4px_30px_-4px_rgba(0,0,0,0.3)] transition-all duration-500 hover:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.4)]"
      style={{
        background: `linear-gradient(to bottom, ${
          theme.bgGradient.split(" ")[0]
        }, ${theme.bgGradient.split(" ")[1]})`,
      }}
    >
      <h1
        className="text-3xl font-bold mb-8 drop-shadow-lg transition-all duration-500"
        style={{ color: theme.textColor }}
      >
        Edit Profile
      </h1>

      {/* Name */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-white text-lg">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 bg-[#ffffff68] text-black placeholder-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent backdrop-blur-sm transition-all duration-300 shadow-[0_0px_29px_10px_rgba(50,50,50,0.2)] hover:shadow-[0_4px_40px_15px_rgba(50,50,50,0.3)] active:shadow-[0_2px_20px_7px_rgba(50,50,50,0.25)]"
          placeholder="Enter name"
        />
        <p className={errorCSS}>{showNameError && nameErrorMessage}</p>
      </div>

      {/* Password */}
      <div className="mb-6 relative">
        <label className="block mb-2 font-semibold text-white text-lg">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={user.password}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 bg-[#ffffff68] text-black placeholder-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent backdrop-blur-sm transition-all duration-300 shadow-[0_0px_29px_10px_rgba(50,50,50,0.2)] hover:shadow-[0_4px_40px_15px_rgba(50,50,50,0.3)] active:shadow-[0_2px_20px_7px_rgba(50,50,50,0.25)]"
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 mt-6 transform -translate-y-1/2 text-white font-semibold hover:text-gray-200 transition-colors"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        <p className={errorCSS}>{showPasswordError && passwordErrorMessage}</p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!user.name || !user.password}
        className="w-full py-3 px-5 rounded-2xl text-white font-bold text-lg transition-all duration-500 shadow-lg hover:shadow-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: theme.buttonColor }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = theme.buttonHoverColor)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = theme.buttonColor)
        }
      >
        Save Changes
      </button>

      {showSuccess && (
        <p className="mt-4 text-xl text-center text-lime-400">
          Changes Saved Successfully!
        </p>
      )}
    </div>
  );
}

export default UserProfile;
