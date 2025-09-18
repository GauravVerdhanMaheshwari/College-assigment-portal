import React, { useState } from "react";

function UserProfile({ userDetails, onSave, theme }) {
  const [user, setUser] = useState(userDetails);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave(user);
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
        User Profile
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
          className="w-full p-3 rounded-xl border border-gray-300 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent backdrop-blur-sm transition-all duration-300"
          placeholder="Enter name"
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-white text-lg">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="w-full p-3 rounded-xl border border-gray-300 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent backdrop-blur-sm transition-all duration-300"
          placeholder="Enter email"
        />
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
          className="w-full p-3 rounded-xl border border-gray-300 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent backdrop-blur-sm transition-all duration-300"
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 mt-6 transform -translate-y-1/2 text-white font-semibold hover:text-gray-200 transition-colors"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3 px-5 rounded-2xl text-white font-bold text-lg transition-all duration-500 shadow-lg hover:shadow-2xl"
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
    </div>
  );
}

export default UserProfile;
