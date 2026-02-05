import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Hero } from "../../components/index";
import {
  StudentAssignmentsList,
  FutureAssignmentsList,
  OtherStudentPaper,
} from "./index.js";
import AccessControlPanel from "./AccessControlPanel.jsx";

function StudentHomePage() {
  const navigate = useNavigate();
  document.title = "Student Home";

  /* 🔐 stable user reference */
  const user = useMemo(() => JSON.parse(sessionStorage.getItem("user")), []);

  const studentId = user.student._id;

  const [searchTerm, setSearchTerm] = useState("");
  const [futureAssignments, setFutureAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (!user?.student || user.student.role !== "student" || !user) {
      sessionStorage.clear();
      navigate("/");
    }
  }, []);

  /* 📦 FETCH DATA (RUNS ONCE) */
  useEffect(() => {
    if (!user?.student) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [assignmentsRes, submissionsRes] = await Promise.all([
          fetch("http://localhost:3000/assignments/"),
          fetch(`http://localhost:3000/papers/student/${user.student._id}`),
        ]);

        if (!assignmentsRes.ok || !submissionsRes.ok) {
          throw new Error("API returned HTML or error page");
        }

        const assignments = await assignmentsRes.json();
        const papers = await submissionsRes.json();

        const studentClass = `${user.student.course}-${user.student.semester}-${user.student.division}`;

        setFutureAssignments(
          assignments.filter((a) => a.assignedTo === studentClass),
        );
        setSubmissions(papers);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* 📤 AFTER UPLOAD */
  const handleUpload = (paper) => {
    setSubmissions((prev) => [paper, ...prev]);
  };

  /* 🔓 TOGGLE PUBLIC */
  const togglePublic = async (paperId) => {
    const res = await fetch(
      `http://localhost:3000/papers/${paperId}/toggle-visibility`,
      { method: "PATCH" },
    );
    const updated = await res.json();

    setSubmissions((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p)),
    );
    location.reload();
  };

  const handleDelete = async (paperId) => {
    confirm("Are you sure you want to delete this submission?") &&
      (await fetch(`http://localhost:3000/papers/${paperId}`, {
        method: "DELETE",
      }));

    setSubmissions((prev) => prev.filter((p) => p._id !== paperId));
  };

  /* ⏳ SAFE LOADING RENDER (AFTER ALL HOOKS) */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading your assignments...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#FFF6E0] to-[#FFE39E] min-h-screen w-full">
      <Header
        wantSearch={true}
        searchPlaceholder="Search assignments..."
        textColor="text-[#073B4C]"
        headerStyle="to-[#FFE9B5] from-[#FFD166]"
        profileNavigate="/student/profile"
        loginPage="/student/login"
        onSearch={(val) => setSearchTerm(val)}
      />

      <div className="p-8">
        <Hero
          user={user.student}
          userRole="Student"
          userObjectName="student"
          heroImg="student_hero.png"
          heroBgColor="to-[#FFCE5BFF] from-[#F8B009FF]"
        />

        <div id="studentAssignments" className="my-6">
          <StudentAssignmentsList
            submissions={submissions}
            onTogglePublic={togglePublic}
            onDelete={handleDelete}
            searchTerm={searchTerm}
            textCSS="text-[#073B4C]"
            buttonCSS="bg-[#78350F] hover:bg-[#78350F]/80 text-white"
          />
        </div>

        <div id="futureAssignments" className="my-6">
          <FutureAssignmentsList
            assignments={futureAssignments}
            submissions={submissions}
            searchTerm={searchTerm}
            textCSS="text-[#073B4C]"
            buttonCSS="bg-[#78350F] hover:bg-[#78350F]/80 text-white"
            onUpload={handleUpload}
          />
        </div>
        <div>
          <OtherStudentPaper studentId={studentId} textCSS="text-[#073B4C]" />
        </div>
        <div>
          <AccessControlPanel />
        </div>
      </div>
    </div>
  );
}

export default StudentHomePage;
