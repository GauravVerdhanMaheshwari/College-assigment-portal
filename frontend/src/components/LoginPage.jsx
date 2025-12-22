import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/* -------------------- ICONS -------------------- */
const EyeIcon = () => (
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
      d="M2.458 12C3.732 7.943 7.523 5 12 5
      c4.478 0 8.268 2.943 9.542 7
      -1.274 4.057-5.064 7-9.542 7
      -4.477 0-8.268-2.943-9.542-7z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19
      c-5.523 0-10-4.477-10-10
      a9.956 9.956 0 012.928-7.071"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.1 6.1A9.956 9.956 0 0112 5
      c5.523 0 10 4.477 10 10
      a9.956 9.956 0 01-4.135 8.13"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

/* -------------------- COMPONENT -------------------- */
function LoginPage({
  inputCSS = "",
  loginSectionCSS = "",
  buttonCSS = "",
  imageSrc,
  imageAlt,
  aLinkCSS = "",
  forgetPasswordLink,
  API,
  h1CSS = "",
  pageAbout,
  redirectLink,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${pageAbout} Login`;
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
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Invalid credentials");
      }

      const data = await response.json();
      sessionStorage.setItem("user", JSON.stringify(data));

      navigate(redirectLink);
    } catch (err) {
      setLoginError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* -------- LEFT LOGIN SECTION -------- */}
      <div
        className={`w-full md:w-[44vw] flex items-center justify-center
        bg-gradient-to-b ${loginSectionCSS}
        px-6 md:px-0`}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-5"
        >
          <h1 className={`text-4xl text-center font-bold ${h1CSS}`}>
            {pageAbout.toUpperCase()} LOGIN
          </h1>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            className={`py-3 px-4 rounded-xl border border-gray-300
            bg-white/90 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400
            transition-all ${inputCSS}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`py-3 px-4 pr-12 w-full rounded-xl border border-gray-300
              bg-white/90 backdrop-blur-sm
              focus:outline-none focus:ring-2 focus:ring-blue-400
              transition-all ${inputCSS}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2
              text-gray-500 hover:text-blue-600 transition"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* Error */}
          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white font-semibold
            hover:scale-[1.03] active:scale-[0.97]
            transition-transform duration-200 ${buttonCSS}`}
          >
            Login
          </button>

          {/* Forget password */}
          {/* <Link
            to={forgetPasswordLink}
            className={`text-center text-sm hover:underline ${aLinkCSS}`}
          >
            Forgot your password?
          </Link> */}
        </form>
      </div>

      {/* -------- RIGHT IMAGE SECTION -------- */}
      <div className="hidden md:block w-[56vw]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-screen w-full object-cover"
        />
      </div>
    </div>
  );
}

export default LoginPage;
