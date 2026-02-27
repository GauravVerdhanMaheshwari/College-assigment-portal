import React, { useEffect } from "react";
import {
  Header,
  Hero,
  List,
  AddUsers,
  PapersList,
  AssignmentsList,
} from "../../components/index";
import { useNavigate } from "react-router-dom";

function AdminHomePage() {
  document.title = "Admin Home";
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [papers, setPapers] = React.useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/papers/userManager")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setPapers(data);
      })
      .catch((error) => {
        console.error("Error fetching papers for Admin:", error);
      });
  }, []);

  useEffect(() => {
    if (!user?.admin) {
      console.log("No user logged in");
      navigate("/admin/login");
    }

    if (user?.admin.role !== "admin") {
      sessionStorage.clear();
      console.log("User is not authorized");
      navigate("/admin/login");
    }
  }, [user, navigate]);

  const dummyReports = [
    {
      id: 1,
      userName: "System Bot",
      userEmail: "system@admin.com",
      message: "New Faculty added",
    },
    {
      id: 2,
      userName: "System Bot",
      userEmail: "system@admin.com",
      message: "New Paper submitted",
    },
  ];

  const isValidEmail = (email) => {
    if (!email || typeof email !== "string") return false;

    // strong but practical regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };

  // 📌 ADD USERS
  const handleAddUser = async (newUser, userAPI, userDetails) => {
    if (!userDetails || Object.keys(userDetails).length === 0) {
      return { success: false, message: "Empty row" };
    }

    // 🔐 AUTO ROLE
    userDetails.role = userAPI === "students" ? "student" : "faculty";

    if (userAPI === "faculties") {
      userDetails.course = Array.isArray(userDetails.course)
        ? userDetails.course
        : [userDetails.course].filter(Boolean);

      userDetails.semester = Array.isArray(userDetails.semester)
        ? userDetails.semester
        : [userDetails.semester].filter(Boolean);

      userDetails.subject = Array.isArray(userDetails.subject)
        ? userDetails.subject
        : [userDetails.subject].filter(Boolean);

      userDetails.division = Array.isArray(userDetails.division)
        ? userDetails.division
        : [userDetails.division].filter(Boolean);
    }

    // Email validation
    if (userDetails.email && !isValidEmail(userDetails.email)) {
      return { success: false, message: "Invalid email format" };
    }

    // Semester validation
    if (userDetails.semester) {
      const sem = parseInt(userDetails.semester, 10);
      if (isNaN(sem) || sem < 1 || sem > 8) {
        return { success: false, message: "Invalid semester" };
      }
      userDetails.semester = sem;
    }

    // Enrollment number normalization
    if (userDetails.enrollmentnumber) {
      userDetails.enrollmentNumber = String(userDetails.enrollmentnumber);
      delete userDetails.enrollmentnumber;
    }

    if (!userDetails.enrollmentNumber && userAPI === "students") {
      return { success: false, message: "Missing enrollmentNumber" };
    }

    if (userDetails.course)
      userDetails.course = String(userDetails.course).toUpperCase();

    if (userDetails.division)
      userDetails.division = String(userDetails.division).toUpperCase();

    userDetails.password = `${userDetails.name}@${
      userDetails.enrollmentNumber?.toString().slice(-4) || "1234"
    }`;

    try {
      const response = await fetch(`http://localhost:3000/${userAPI}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || "Backend rejected",
        };
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: `Network error: ${err.message}` };
    }
  };

  // 📌 EDIT
  const handleEdit = async (entity, type) => {
    try {
      if (!entity || !entity._id) {
        alert("Invalid data. Please refresh and try again.");
        return;
      }

      // ✅ deep clean null / undefined
      const deepClean = (obj) => {
        return Object.fromEntries(
          Object.entries(obj).filter(([_, value]) => {
            console.log(_);
            if (value === null || value === undefined) return false;

            if (typeof value === "string" && value.trim() === "") return false;

            if (Array.isArray(value) && value.length === 0) return false;

            return true;
          }),
        );
      };

      const cleanedEntity = deepClean(entity);

      // ✅ extra safety for faculties
      if (type === "Faculties") {
        const ensureArray = (val) =>
          Array.isArray(val) ? val.filter(Boolean) : val ? [val] : [];

        cleanedEntity.course = ensureArray(cleanedEntity.course);
        cleanedEntity.semester = ensureArray(cleanedEntity.semester);
        cleanedEntity.subject = ensureArray(cleanedEntity.subject);
        cleanedEntity.division = ensureArray(cleanedEntity.division);
      }

      const res = await fetch(`http://localhost:3000/${type}/${entity._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedEntity),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.message || "Failed to update");
        throw new Error(data?.message || "Failed to update");
      }

      alert(`${entity.name || entity.title} updated successfully!`);
      return data;
    } catch (err) {
      console.error(err);
      alert(`Error updating: ${err.message}`);
      throw err;
    }
  };

  // 📌 DELETE
  const handleDelete = async (entity, type) => {
    const ok = window.confirm(
      `Are you sure you want to delete ${entity.name || entity.title}?`,
    );
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:3000/${type}/${entity._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      alert(`${entity.name || entity.title} deleted successfully!`);
      return true;
    } catch (err) {
      console.error(err);
      alert(`Error deleting: ${err.message}`);
      throw err;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#A7F3D0] to-[#34D399]">
      <div className="flex flex-col h-full">
        {/* HEADER */}
        <div className="mb-6">
          <Header
            textColor="text-[#4D7BFAFF] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
            headerStyle="from-[#A7F3D0] to-[#34D399]"
            menuLinks={[
              { name: "Home", href: "/admin" },
              { name: "Users", href: "#userList" },
              { name: "Add User", href: "#addUsers" },
              { name: "Papers", href: "#papersList" },
            ]}
            wantSearch={false}
            dummyReports={dummyReports}
            profileNavigate="/admin/profile"
            loginPage="/admin/login"
          />
        </div>

        {/* HERO */}
        <div className="mb-10">
          <Hero
            user={user.admin}
            userRole={"Admin"}
            userObjectName="admin"
            heroImg="admin_hero.png"
            heroBgColor="from-[#A7F3D0] to-[#34D399]"
          />
        </div>

        {/* USERS LIST */}
        <div id="userList">
          <List
            entityNames={[
              "Library Managers",
              "User Managers",
              "Students",
              "Faculties",
            ]}
            entityFields={[
              ["Name", "Email"],
              ["Name", "Email"],
              [
                "Enrollment No",
                "Name",
                "Email",
                "Course",
                "Division",
                "Year of Joining",
                "Semester",
              ],
              ["Name", "Email", "Subject", "Course", "Semester", "Division"],
            ]}
            entityKeys={[
              ["name", "email"],
              ["name", "email"],
              [
                "enrollmentNumber",
                "name",
                "email",
                "course",
                "division",
                "yearOfJoining",
                "semester",
              ],
              ["name", "email", "subject", "course", "semester", "division"],
            ]}
            entityEndpoints={[
              "library-managers",
              "user-managers",
              "students",
              "faculties",
            ]}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>

        {/* ADD USERS */}
        <div id="addUsers">
          <AddUsers
            currentRole={"Admin"}
            userToAdd={[
              "Library Managers",
              "User Managers",
              "Students",
              "Faculties",
            ]}
            userDataBaseEntry={{
              "Library Managers": [
                { field: "name", type: "text" },
                { field: "email", type: "email" },
              ],
              "User Managers": [
                { field: "name", type: "text" },
                { field: "email", type: "email" },
              ],
              Students: [
                { field: "enrollmentNumber", type: "number" },
                { field: "name", type: "text" },
                { field: "email", type: "email" },
                { field: "yearOfJoining", type: "number" },
                { field: "course", type: "multiselect" },
                { field: "division", type: "multiselect" },
                { field: "semesters", type: "multiselect" },
              ],
              Faculties: [
                { field: "name", type: "text" },
                { field: "email", type: "email" },
                { field: "subject", type: "multiselect" },
                { field: "course", type: "multiselect" },
                { field: "semesters", type: "multiselect" },
                { field: "division", type: "multiselect" },
              ],
            }}
            handleAddUser={handleAddUser}
          />
        </div>

        {/* PAPERS LIST */}
        <div id="papersList" className="mt-10">
          <PapersList
            papersAPI="admin"
            userID={user?.admin?._id}
            papers={papers}
            textCSS="text-[#4D7BFAFF] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
            buttonCSS="bg-[#3B96FFFF] hover:bg-[#55A3FCFF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)] text-white"
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>

        <div>
          <AssignmentsList />
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
