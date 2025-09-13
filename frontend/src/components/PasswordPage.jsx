import React from "react";
import { Link } from "react-router-dom";

function PasswordPage({
  loginSectionCSS,
  buttonCSS,
  aLinkCSS,
  API,
  loginPageLink,
  imageSrc,
  imageAlt,
  h1CSS,
  inputCSS,
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forget password logic here
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("API Endpoint:", API);
  };

  return (
    <div className="flex flex-row align-middle justify-center">
      <div
        className={`w-[44vw] h-[100vh] flex absolute left-0 items-center justify-center bg-gradient-to-b ${loginSectionCSS} rounded-r-[40px] shadow-2xl`}
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h1 className={`text-4xl text-center ${h1CSS} mb-6`}>
            FORGET PASSWORD
          </h1>
          <input
            type="text"
            placeholder="Enter your name"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffc6] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(0,_0,_0,_0.3)] transition-all duration-300 ease-in-out ${inputCSS}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffc6] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(_0,_0,_0,_0.3)] transition-all duration-300 ease-in-out ${inputCSS}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className={`${buttonCSS} w-45 text-lg mb-2 mx-auto text-white py-2 px-3 rounded-2xl hover:rounded-3xl transition-all duration-300 cursor-pointer ease-in-out`}
          >
            SEND REQUEST
          </button>
          <Link
            to={loginPageLink}
            className={`text-center ${aLinkCSS} mt-3 hover:underline transition-all duration-300 ease-in-out`}
          >
            GO BACK
          </Link>
        </form>
      </div>
      <div className="h-[100vh] absolute -z-1 right-0 w-[60vw]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default PasswordPage;
