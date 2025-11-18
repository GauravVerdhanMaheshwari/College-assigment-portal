import React, { useState, useEffect } from "react";
import { Header, Hero, PapersList } from "../../components/index";
import { useNavigate } from "react-router-dom";

function LibraryManagerHomePage() {
  document.title = "Library Manager Home";

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setPapers(dummyPapers);
    }, 500);
  });

  useEffect(() => {
    if (!user) {
      sessionStorage.clear();
      console.log("No user logged in");
      navigate("/libraryManager/login");
    }

    if (user.role !== "libraryManager") {
      sessionStorage.clear();
      console.log("User is not a Library Manager");
      navigate("/libraryManager/login");
    }
  }, [user, navigate]);

  // Dummy paper data
  const dummyPapers = [
    {
      _id: "1",
      title: "AI in Modern Agriculture",
      studentName: "Alice Johnson",
      class: "C",
      section: "3",
      course: "CE",
      submissionDate: "2025-09-15",
      fileLink: "/papers/ai_agriculture.pdf",
    },
    {
      _id: "2",
      title: "Blockchain in Supply Chain",
      studentName: "Bob Smith",
      class: "C",
      section: "3",
      course: "CE",
      submissionDate: "2025-09-16",
      fileLink: "/papers/blockchain_supplychain.pdf",
    },
  ];

  const dummyReports = [
    {
      id: 1,
      userName: "John Doe",
      userEmail: "john@example.com",
      message: "New paper submitted: AI in Modern Agriculture",
    },
    {
      id: 2,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      message: "New paper submitted: Blockchain in Supply Chain",
    },
  ];

  return (
    <div className="w-full h-[110vh] bg-gradient-to-b from-[#38BDF8] to-[#8B5CF6]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <Header
            textColor="text-[#1E3A8A] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
            headerStyle="from-[#38BDF8] to-[#8B5CF6]"
            menuLinks={[
              { name: "Home", href: "/library-manager-home" },
              { name: "Student Papers", href: "#papersList" },
            ]}
            wantSearch={false}
            dummyReports={dummyReports}
            profileNavigate="/libraryManager/profile"
            loginPage="/libraryManager/login"
          />
        </div>

        {/* Hero */}
        <div className="mb-10">
          <Hero
            user={user}
            userRole={"Library Manager"}
            userObjectName="libraryManager"
            heroImg="library_manager_hero.jpg"
            heroBgColor="from-[#38BDF8] to-[#8B5CF6]"
          />
        </div>

        {/* Papers List Component */}
        <PapersList
          papers={papers}
          textCSS="text-[#1E3A8A] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
          buttonCSS="bg-[#6EE7B7] hover:bg-[#5CC198FF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)] text-[#1E3A8A]"
        />
      </div>
    </div>
  );
}

export default LibraryManagerHomePage;
