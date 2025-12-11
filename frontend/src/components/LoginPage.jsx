import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  pageAbout,
  redirectLink,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // sessionStorage.setItem("user", JSON.stringify({}));

  useEffect(() => {
    document.title = `${pageAbout} Login Page`;
  }, [pageAbout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();
      sessionStorage.setItem("user", JSON.stringify(data));

      setEmail("");
      setPassword("");
      setLoginError("");
      navigate(redirectLink);
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex flex-row align-middle justify-center">
      <div
        className={`w-[44vw] h-[100vh] flex absolute left-0 items-center justify-center bg-gradient-to-b ${loginSectionCSS} rounded-r-[40px] shadow-[10px_10px_20px_1px_rgba(0,_0,_0,_0.1)]`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h1 className={`text-4xl text-center ${h1CSS} mb-6`}>LOGIN</h1>

          <input
            type="email"
            placeholder="Enter your email"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffa1] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(_0,_0,_0,_0.3)] transition-all duration-300 ease-in-out${inputCSS}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="mb-4 flex flex-row">
            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffa1] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(_0,_0,_0,_0.3)] transition-all duration-300 ease-in-out${inputCSS}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="ml-2 mt-4">
              <label
                htmlFor="showPassword"
                className="text-black bg-blue-300 px-2 py-1 rounded-full hover:bg-blue-400 hover:shadow-[-4px_4px_5px_rgba(0,0,0,.1)] font-semibold cursor-pointer select-none transition-all duration-300 ease-in-out hover:text-shadow-[-4px_4px_5px_rgba(0,0,0,.1)]"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-30 text-lg mb-2 mx-auto text-white py-2 px-3 rounded-2xl hover:rounded-3xl transition-all duration-300 cursor-pointer ease-in-out ${buttonCSS}`}
          >
            ENTER
          </button>

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
