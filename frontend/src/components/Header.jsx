import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

function Header({
  wantSearch,
  headerStyle,
  textColor,
  profileNavigate,
  loginPage = "/",
  searchPlaceholder = "Search...",
  menuLinks = [],
  onSearch,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // close menus when route changes
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (path) => navigate(path);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div
      className={`bg-gradient-to-t ${headerStyle} ${textColor} flex flex-row items-center p-4 shadow-[2px_5px_10px_1px_rgba(0,0,0,0.12)] rounded-b-4xl mx-4 relative`}
      ref={menuRef}
    >
      <div className="flex flex-row ml-2 items-center">
        <div
          className="w-12 h-12 ml-3 mb-3 mr-7 cursor-pointer flex flex-col justify-center"
          onClick={() => setIsMenuOpen((s) => !s)}
        >
          <div className="bg-[#464646] rounded-2xl py-1 px-5 m-1"></div>
          <div className="bg-[#464646] rounded-2xl py-1 px-3 m-1"></div>
          <div className="bg-[#464646] rounded-2xl py-1 px-5 m-1"></div>
        </div>

        {wantSearch && (
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="border border-gray-300 bg-[#ffffffd9] rounded-xl p-2 my-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F0C36A] transition-all text-lg shadow-sm"
          />
        )}
      </div>

      <div className="flex-grow flex flex-row justify-end items-center gap-6 mr-7 relative">
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.href.startsWith("#")) {
                      const id = link.href.replace("#", "");
                      const el = document.getElementById(id);
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    } else {
                      handleNavigate(link.href);
                    }
                    setIsMenuOpen(false);
                  }}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800 font-medium transition cursor-pointer"
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
            href={loginPage}
            onClick={() => {
              sessionStorage.clear();
              handleNavigate(loginPage);
            }}
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
