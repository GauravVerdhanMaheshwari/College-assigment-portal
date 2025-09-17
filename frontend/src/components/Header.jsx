import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

function Header({
  wantSearch,
  headerStyle,
  textColor,
  profileNavigate,
  searchPlaceholder = "Search...",
  menuLinks = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const dummyReports = [
    {
      id: 1,
      userName: "John Doe",
      userEmail: "john@example.com",
      message: "Reported inappropriate behavior",
    },
    {
      id: 2,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      message: "Reported missing submission",
    },
    {
      id: 3,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      message: "Reported missing submission",
    },
  ];

  const handleRemoveReport = (id) => {
    console.log("Removed report:", id);
  };

  const handleSendEmail = (report) => {
    console.log("Send email to:", report.userEmail);
    alert(`Send email to ${report.userName}`);
  };

  const handleNavigate = (path) => navigate(path);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`bg-gradient-to-t ${headerStyle} ${textColor} flex flex-row items-center p-4 shadow-[2px_5px_10px_1px_rgba(0,_0,_0,_0.4)] rounded-b-4xl mx-4 relative`}
      ref={menuRef}
    >
      {/* Left Side: Hamburger + Search */}
      <div className="flex flex-row ml-2 items-center">
        <div
          className="w-12 h-12 ml-3 mb-3 mr-7 cursor-pointer flex flex-col justify-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="bg-[#464646] rounded-2xl py-1 px-5 m-1"></div>
          <div className="bg-[#464646] rounded-2xl py-1 px-3 m-1"></div>
          <div className="bg-[#464646] rounded-2xl py-1 px-5 m-1"></div>
        </div>

        {wantSearch && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="border border-gray-300 bg-[#ffffff97] rounded-xl p-2 my-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xl shadow-md focus:shadow-lg shadow-gray-600 focus:text-black"
          />
        )}
      </div>

      {/* Right Side: Notifications + Profile */}
      <div className="flex-grow flex flex-row justify-end items-center gap-6 mr-7 relative">
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="text-2xl font-semibold px-3 py-2 rounded-full hover:bg-gray-200 transition relative"
          >
            🔔
            {dummyReports.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {dummyReports.length}
              </span>
            )}
          </button>
          {isNotifOpen && (
            <div className="absolute right-0 top-12 z-50">
              <NotificationPanel
                reports={dummyReports}
                onRemove={handleRemoveReport}
                onSendEmail={handleSendEmail}
                theme={{ bgColor: "#f9f9f9", textColor: "#333" }}
              />
            </div>
          )}
        </div>

        <div>
          <img
            src="/user_profile.png"
            alt="Avatar"
            onClick={() => handleNavigate(profileNavigate)}
            className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:shadow-lg transition-all duration-200 ease-in-out hover:scale-105 cursor-pointer"
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-6 bg-white shadow-xl rounded-xl p-4 w-48 z-50">
          <ul className="flex flex-col gap-3">
            {menuLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800 font-medium transition"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <button>
          <a
            href="/user-manager-login"
            className="text-white font-semibold px-4 py-3 mr-2 rounded-full hover:bg-red-400 transition-all duration-300 bg-red-500"
          >
            Logout
          </a>
        </button>
      </div>
    </div>
  );
}

export default Header;
