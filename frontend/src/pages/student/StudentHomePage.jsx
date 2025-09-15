import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/index.js";

function StudentHomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      try {
        setUser(JSON.parse(storedUser).student);
      } catch {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <div className="bg-gradient-to-b from-[#FFF6E0] to-[#FFE39E] w-[100vw] h-[100vh]">
      <Header
        textColor="text-[#073B4C]"
        headerStyle="to-[#FFE9B5] from-[#FFD166]"
      />
      <div className="p-10">
        <h1 className="text-4xl font-bold text-[#073B4C] mb-6">
          Welcome, {user ? user.name : "Student"}!
        </h1>
        <p className="text-lg text-[#073B4C]">
          This is your student dashboard. Here you can access your courses, view
          grades, and manage your profile.
        </p>
      </div>
    </div>
  );
}

export default StudentHomePage;
