import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function LoginPage({
  inputCSS,
  loginSectionCSS,
  buttonCSS,
  imageSrc,
  imageAlt,
  aLinkCSS,
  forgetPasswordLink,
  API,
  h1CSS,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    document.title = "Login Page";
  }, []);

  const handleSubmit = (email, password) => {
    fetch(`http://localhost:3000/${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Invalid credentials");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Login successful:", data);
        setLoginError("");
        setName("");
        setEmail("");
        setPassword("");
        alert("Login successful");
        // redirect or store token here
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoginError(error.message || "Something went wrong!");
      });
  };

  return (
    <div className="flex flex-row align-middle justify-center">
      <div
        className={`w-[44vw] h-[100vh] flex absolute left-0 items-center justify-center bg-gradient-to-b ${loginSectionCSS} rounded-r-[40px] shadow-[10px_10px_20px_1px_rgba(0,_0,_0,_0.1)]`}
      >
        <form className="flex flex-col">
          <h1 className={`text-4xl text-center ${h1CSS} mb-6`}>LOGIN</h1>
          <input
            type="text"
            placeholder="Enter your name"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffa1] shadow-md focus:outline-none transition-all ${inputCSS}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffa1] shadow-md focus:outline-none transition-all ${inputCSS}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffa1] shadow-md focus:outline-none transition-all ${inputCSS}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={`w-30 text-lg mb-2 mx-auto text-white py-2 px-3 rounded-2xl hover:rounded-3xl transition-all duration-300 cursor-pointer ease-in-out ${buttonCSS}`}
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(email, password);
            }}
          >
            ENTER
          </button>

          {/* 👇 Show error if wrong credentials */}
          {loginError && (
            <p className="text-red-500 text-center mt-2">{loginError}</p>
          )}

          <Link
            to={forgetPasswordLink}
            className={`text-center ${aLinkCSS} mt-3 hover:underline transition-all`}
          >
            FORGET YOUR PASSWORD?
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

export default LoginPage;
