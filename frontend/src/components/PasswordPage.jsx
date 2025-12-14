import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PasswordPage({
  loginSectionCSS = "",
  buttonCSS = "",
  aLinkCSS = "",
  API,
  loginPageLink,
  imageSrc,
  imageAlt,
  h1CSS = "",
  inputCSS = "",
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Forgot Password";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔹 Replace this with real API call later
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("API:", API);

    setMessage("If this email exists, a reset link will be sent.");
    setName("");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex">
      {/* -------- LEFT SECTION -------- */}
      <div
        className={`w-full md:w-[44vw] flex items-center justify-center
        bg-gradient-to-b ${loginSectionCSS}
        px-6`}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm flex flex-col gap-5"
        >
          <h1 className={`text-4xl text-center font-bold ${h1CSS}`}>
            FORGOT PASSWORD
          </h1>

          <p className="text-center text-sm text-gray-600">
            Enter your registered name and email to reset your password.
          </p>

          {/* Name */}
          <input
            type="text"
            placeholder="Full name"
            className={`py-3 px-4 rounded-xl border border-gray-300
            bg-white/90 backdrop-blur-sm
            focus:outline-none focus:ring-2 focus:ring-blue-400
            transition-all ${inputCSS}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          {/* Info message */}
          {message && (
            <p className="text-green-600 text-sm text-center">{message}</p>
          )}

          {/* Button */}
          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white font-semibold
            hover:scale-[1.03] active:scale-[0.97]
            transition-transform duration-200 ${buttonCSS}`}
          >
            Send Reset Link
          </button>

          {/* Back to login */}
          <Link
            to={loginPageLink}
            className={`text-center text-sm hover:underline ${aLinkCSS}`}
          >
            Back to Login
          </Link>
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

export default PasswordPage;
