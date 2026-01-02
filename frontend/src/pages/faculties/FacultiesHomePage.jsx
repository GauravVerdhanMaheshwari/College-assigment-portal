// FacultiesHomePage.jsx
import React, { useEffect, useState } from "react";
import { Header, Hero } from "../../components/index";
import {
  FacultyPapers,
  AssignmentForm,
  AssignmentsList,
} from "../../components/index";

import { useNavigate } from "react-router-dom";

function FacultiesHomePage() {
  document.title = "Faculties Home";
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user?.faculty) {
      console.log("No user logged in");
      navigate("/faculties/login");
    }

    if (user?.faculty.role !== "faculty") {
      console.log("User is not a Faculty");
      navigate("/faculties/login");
    }
  }, [user, navigate]);

  const [papers, setPapers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/papers/faculty")
      .then((res) => res.json())
      .then((data) => setPapers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#C4B5FD] to-[#8B5CF6]">
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="mb-6">
          <Header
            textColor="text-[#4C1D95] text-shadow-[0px_0px_10px_rgba(124,58,237,0.9)]"
            headerStyle="from-[#C4B5FD] to-[#8B5CF6]"
            menuLinks={[
              { name: "Home", href: "/faculties/home" },
              { name: "Papers", href: "#facultyPapers" },
              { name: "Assignments", href: "#assignmentsList" },
              { name: "Add Assignment", href: "#assignmentForm" },
            ]}
            wantSearch={false}
            dummyReports={[
              {
                id: 1,
                userName: "System Bot",
                userEmail: "system@faculty.com",
                message: "New assignment added",
              },
            ]}
            profileNavigate="/faculties/profile"
            loginPage="/faculties/login"
          />
        </div>

        {/* HERO */}
        <div className="mb-10">
          <Hero
            user={user.faculty}
            userRole={"Faculty"}
            userObjectName="faculty"
            heroImg="faculty_hero.jpg"
            heroBgColor="from-[#C4B5FD] to-[#8B5CF6]"
          />
        </div>

        {/* PAPERS SECTION */}
        <div id="facultyPapers" className="mb-12">
          <FacultyPapers
            papers={papers}
            textCSS="text-[#4C1D95]"
            buttonCSS="bg-[#4C1D95] text-white"
          />
        </div>

        {/* ASSIGNMENTS LIST */}
        <div id="assignmentsList" className="mb-12">
          <AssignmentsList textCSS="text-[#4C1D95] text-shadow-[0px_0px_10px_rgba(124,58,237,0.9)]" />
        </div>

        {/* ASSIGNMENT FORM */}
        <div id="assignmentForm" className="mb-12">
          <AssignmentForm
            textCSS="text-[#4C1D95] text-shadow-[0px_0px_10px_rgba(124,58,237,0.9)]"
            buttonCSS="bg-[#4C1D95] hover:bg-[#4C1D95]/70 hover:shadow-[4px_4px_16px_1px_rgba(97,41,186,0.4)] text-white"
          />
        </div>
      </div>
    </div>
  );
}

export default FacultiesHomePage;
