import React, { useState } from "react";

function Login({
  inputCSS,
  loginSectionCSS,
  buttonCSS,
  imageSrc,
  imageAlt,
  aLinkCSS,
  API,
  h1CSS,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (name, email, password) => {
    // Handle login logic here
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("API Endpoint:", API);
  };

  return (
    <div className="flex flex-row align-middle justify-center">
      <div
        className={`w-[44vw] h-[100vh] flex absolute left-0 items-center justify-center bg-gradient-to-b ${loginSectionCSS} rounded-r-[40px] shadow-[10px_10px_20px_1px_rgba(0,_0,_0,_0.1)]`}
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h1 className={`text-4xl text-center ${h1CSS} mb-6`}>LOGIN</h1>
          <input
            type="text"
            placeholder="Enter your name"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffc6] shadow-[7px_7px_10px_1px_rgba(0,_0,_0,_0.1)] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(0,_0,_0,_0.3)] transition-all duration-300 ease-in-out ${inputCSS}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffc6] shadow-[7px_7px_10px_1px_rgba(0,_0,_0,_0.1)] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(_0,_0,_0,_0.3)] transition-all duration-300 ease-in-out ${inputCSS}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffc6] shadow-[7px_7px_10px_1px_rgba(0,_0,_0,_0.1)] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(0,_0,_0,_0.3)] transition-all duration-300 ease-in-out ${inputCSS}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={`w-30 text-lg mb-2 mx-auto text-white py-2 px-3 rounded-2xl hover:rounded-3xl transition-all duration-300 cursor-pointer ease-in-out ${buttonCSS}`}
          >
            ENTER
          </button>
          <a
            href="#"
            className={`text-center ${aLinkCSS} mt-3 hover:underline transition-all duration-300 ease-in-out`}
          >
            FORGET YOUR PASSWORD?
          </a>
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

export default Login;
