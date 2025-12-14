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
          <h1 className={`text-4xl text-center ${h1CSS} mb-6`}>
            {pageAbout.toUpperCase()} LOGIN PAGE
          </h1>

          <input
            type="email"
            placeholder="Enter your email"
            className={`mb-6 py-3 px-2 w-80 rounded-xl border border-gray-300 bg-[#ffffffa1] focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(_0,_0,_0,_0.3)] transition-all duration-300 ease-in-out${inputCSS}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="mb-4 flex flex-row">
            <div className="mb-4 relative w-80">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`py-3 px-3 pr-12 w-full rounded-xl border border-gray-300 bg-[#ffffffa1]
      focus:outline-none focus:shadow-[7px_7px_8px_1px_rgba(0,0,0,0.3)]
      transition-all duration-300 ease-in-out ${inputCSS}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Show / Hide Button */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2
      text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
              >
                {showPassword ? (
                  /* Eye Off Icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.956 9.956 0 012.928-7.071M6.1 6.1A9.956 9.956 0 0112 5c5.523 0 10 4.477 10 10a9.956 9.956 0 01-4.135 8.13M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
                  /* Eye Icon */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
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
