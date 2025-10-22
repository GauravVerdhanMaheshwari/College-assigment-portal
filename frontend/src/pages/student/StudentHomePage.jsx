import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Hero, NotificationPanel } from "../../components/index";
import {
  StudentAssignmentsList,
  AssignmentUploadForm,
  FutureAssignmentsList,
} from "./index.js";

function StudentHomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const [searchTerm, setSearchTerm] = useState("");

  // Dummy faculty assignments (future)
  const [futureAssignments] = useState([
    {
      id: "A1",
      topic: "React Basics",
      subject: "Web Development",
      assignedBy: "Prof. Sharma",
      division: "C",
      course: "C.E",
      year: 5,
      dueDate: "2025-09-25",
      description: "Intro to components, props and state",
    },
    {
      id: "A2",
      topic: "AI Ethics",
      subject: "AI",
      assignedBy: "Prof. Rao",
      division: "B",
      course: "C.E",
      year: 4,
      dueDate: "2025-10-01",
      description: "Essay on ethics in AI",
    },
  ]);

  // Dummy peer requests (notifications)
  const [requests, setRequests] = useState([
    {
      id: "R1",
      requesterName: "Bob",
      requesterEmail: "bob@student.edu",
      paperId: "S1",
      message: "Please allow access to my React Basics submission",
      status: "pending",
    },
  ]);

  // Student's own submissions
  const [submissions, setSubmissions] = useState([
    {
      id: "S1",
      title: "React Basics - My Submission",
      fileName: "react_basics_alice.pdf",
      division: "C",
      course: "C.E",
      year: 5,
      public: false,
      uploadedAt: "2025-09-12",
    },
  ]);

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      navigate("/");
    }
  }, [navigate]);

  const handleUpload = (newSubmission) => {
    setSubmissions((prev) => [
      {
        id: `S${Date.now()}`,
        ...newSubmission,
        uploadedAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    alert("Submission uploaded (UI only).");
  };

  const togglePublic = (id) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, public: !s.public } : s))
    );
  };

  const handleRequestAction = (requestId, action) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: action } : r))
    );
    alert(`Request ${action}`);
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-b from-[#FFF6E0] to-[#FFE39E] min-h-screen w-full">
      <Header
        wantSearch={true}
        searchPlaceholder="Search assignments..."
        textColor="text-[#073B4C] text-shadow-[0px_0px_10px_rgba(7,59,76,0.9)]"
        headerStyle="to-[#FFE9B5] from-[#FFD166]"
        profileNavigate="/student-profile"
        dummyReports={requests}
        loginPage="/"
        menuLinks={[
          { name: "Home", href: "/student" },
          { name: "Assignments", href: "#studentAssignments" },
          { name: "Future Assignments", href: "#futureAssignments" },
          { name: "Peer Submissions", href: "#peerSubmissions" },
        ]}
        onSearch={(val) => setSearchTerm(val)}
      />

      <div className="p-8">
        <Hero
          user={user}
          userRole="Student"
          userObjectName="student"
          heroImg="student_hero.png"
          heroBgColor="to-[#FFCE5BFF] from-[#F8B009FF]"
        />

        {/* Submissions */}
        <div id="studentAssignments" className="my-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#073B4C]">
              Your Submissions
            </h2>
          </div>

          <StudentAssignmentsList
            submissions={submissions}
            onTogglePublic={togglePublic}
            searchTerm={searchTerm}
            textCSS="text-[#073B4C]"
            buttonCSS="bg-[#78350F] hover:bg-[#78350F]/80 text-white"
          />
        </div>

        {/* Future assignments */}
        <div id="futureAssignments" className="my-6">
          <FutureAssignmentsList
            assignments={futureAssignments}
            searchTerm={searchTerm}
            textCSS="text-[#073B4C]"
            buttonCSS="bg-[#78350F] hover:bg-[#78350F]/80 text-white"
            onUpload={handleUpload}
          />
        </div>

        {/* Peer requests */}
        <div id="peerSubmissions" className="my-6">
          <h2 className="text-2xl font-bold text-[#073B4C] mb-4">
            Peer Access Requests
          </h2>
          <NotificationPanel
            reports={requests}
            onApprove={(id) => handleRequestAction(id, "approved")}
            onDeny={(id) => handleRequestAction(id, "denied")}
            theme={{ bgColor: "#fff7ed", textColor: "#073B4C" }}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentHomePage;
