import React from "react";
import { Header, Hero, List } from "../../components/index";
import { useNavigate } from "react-router-dom";

function UserManagerHomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    navigate("/user-manager-login");
    return null;
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#C4B5FD] to-[#8B5CF6]">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <Header
            textColor="text-[#0EA5E9]"
            headerStyle="to-[#C4B5FD] from-[#A37BFFFF]"
          />
        </div>

        <div className="mb-10">
          <Hero
            user={user}
            userRole={"User Manager"}
            userObjectName="userManager"
            heroImg="user_manager_hero.jpg"
            heroBgColor="to-[#A37BFFFF] from-[#C4B5FD]"
          />
        </div>

        <List
          entityNames={["Students", "Faculties"]}
          entityFields={[
            ["Enrollment No", "Name", "Email", "Course", "Division", "Year"],
            ["Name", "Email", "Subject", "Course", "Year", "Division"],
          ]}
          entityKeys={[
            ["enrollmentNumber", "name", "email", "course", "division", "year"],
            ["name", "email", "subject", "course", "year", "division"],
          ]}
          entityEndpoints={["students", "faculties"]}
        />
      </div>
    </div>
  );
}

export default UserManagerHomePage;
