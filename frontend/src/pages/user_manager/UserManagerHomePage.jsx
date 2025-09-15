import React from "react";
import { Header, Hero } from "../../components/index";
import { useNavigate } from "react-router-dom";

function UserManagerHomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log(user);

  if (!user) {
    navigate("/user-manager-login");
    return null;
  }

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-b from-[#C4B5FD] to-[#8B5CF6]">
      <div className="flex flex-col h-full">
        <div>
          <Header
            textColor="text-[#0EA5E9]"
            headerStyle="to-[#C4B5FD] from-[#A37BFFFF]"
          />
        </div>
        <div className="flex flex-col p-0 mt-5">
          <Hero
            heroImg="user_manager_hero.jpg"
            heroBgColor="to-[#A37BFFFF] from-[#C4B5FD]"
          />
        </div>
      </div>
    </div>
  );
}

export default UserManagerHomePage;
