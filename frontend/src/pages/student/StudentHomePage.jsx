import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Hero } from "../../components/index.js";

function StudentHomePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        navigate("/");
      }
    }
  }, [navigate]);

  console.log(user);

  return (
    <div className="bg-gradient-to-b from-[#FFF6E0] to-[#FFE39E] w-[100vw] h-[100vh]">
      <Header
        textColor="text-[#073B4C]"
        headerStyle="to-[#FFE9B5] from-[#FFD166]"
      />
      <div className="p-10">
        <div className="mb-10">
          <Hero
            user={user}
            userRole={"Student"}
            userObjectName="student"
            heroImg="student_hero.png"
            heroBgColor="to-[#FFCE5BFF] from-[#F8B009FF]"
          />
        </div>
      </div>
    </div>
  );
}

export default StudentHomePage;
