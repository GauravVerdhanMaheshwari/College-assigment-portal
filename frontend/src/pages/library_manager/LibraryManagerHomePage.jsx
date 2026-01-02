import React, { useState, useEffect } from "react";
import { Header, Hero, PapersList } from "../../components/index";
import { useNavigate } from "react-router-dom";

function LibraryManagerHomePage() {
  document.title = "Library Manager Home";

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [papers, setPapers] = useState([]);

  useEffect(() => {
    if (!user?.libraryManager) {
      sessionStorage.clear();
      console.log("No user logged in");
      navigate("/libraryManager/login");
    }

    if (user?.libraryManager.role !== "libraryManager") {
      sessionStorage.clear();
      console.log("User is not a Library Manager");
      navigate("/libraryManager/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch papers from the backend API
    const fetchPapers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/papers/userManager",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPapers(data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, []);

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#38BDF8] to-[#8B5CF6]">
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
            profileNavigate="/libraryManager/profile"
            loginPage="/libraryManager/login"
          />
        </div>

        {/* Hero */}
        <div className="mb-10">
          <Hero
            user={user.libraryManager}
            userRole={"Library Manager"}
            userObjectName="libraryManager"
            heroImg="library_manager_hero.jpg"
            heroBgColor="from-[#38BDF8] to-[#8B5CF6]"
          />
        </div>

        {/* Papers List Component */}
        <PapersList
          papers={papers}
          papersAPI="libraryManager"
          userID={user?.libraryManager?._id}
          textCSS="text-[#1E3A8A] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
          buttonCSS="bg-[#6EE7B7] hover:bg-[#5CC198FF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)] text-[#1E3A8A]"
        />
      </div>
    </div>
  );
}

export default LibraryManagerHomePage;
