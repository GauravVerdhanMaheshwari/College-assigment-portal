import React from "react";

function Header({ headerStyle, textColor, searchPlaceholder = "Search..." }) {
  return (
    <div
      className={`bg-gradient-to-t ${headerStyle} ${textColor} flex flex-row items-center p-4 shadow-[0px_4px_16px_1px_rgba(0,_0,_0,_0.1)] rounded-b-4xl`}
    >
      <div className="flex flex-row ml-2">
        <div className="w-12 h-12 my-1 ml-3 mr-5 ">
          <div className=" bg-[#464646] rounded-2xl py-1 px-5 m-2"></div>
          <div className="bg-[#464646] rounded-2xl py-1 px-3 m-2"></div>
          <div className="bg-[#464646] rounded-2xl py-1 px-5 m-2"></div>
        </div>
        <div className="text-2xl font-semibold ">
          <input
            type="text"
            className="border border-gray-300 bg-[#ffffff97] rounded-xl p-2 my-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xl shadow-md focus:shadow-lg shadow-gray-600 focus:text-black"
            placeholder={searchPlaceholder}
          />
        </div>
      </div>
      <div className="flex-grow flex flex-row justify-end items-center gap-6 mr-4">
        <div>
          <h1 className="text-2xl font-semibold">Notification</h1>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>
      </div>
    </div>
  );
}

export default Header;
