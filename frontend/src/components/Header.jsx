import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header({
  wantSearch,
  headerStyle,
  textColor,
  profileNavigate,
  searchPlaceholder = "Search...",
  menuLinks = [],
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`bg-gradient-to-t ${headerStyle} ${textColor} flex flex-row items-center p-4 shadow-[2px_5px_10px_1px_rgba(0,_0,_0,_0.4)] rounded-b-4xl mx-4 relative`}
      ref={menuRef}
    >
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
          <div className="text-2xl font-semibold">
            <input
              type="text"
              className="border border-gray-300 bg-[#ffffff97] rounded-xl p-2 my-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xl shadow-md focus:shadow-lg shadow-gray-600 focus:text-black"
              placeholder={searchPlaceholder}
            />
          </div>
        )}
      </div>

      {/* Right Side */}
      <div className="flex-grow flex flex-row justify-end items-center gap-6 mr-7">
        <div>
          <h1 className="text-2xl font-semibold">Notification</h1>
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
    </div>
  );
}

export default Header;
