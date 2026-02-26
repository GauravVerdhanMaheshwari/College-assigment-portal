import React, { useEffect, useState } from "react";
import { Header, Hero, List, AddUsers } from "../../components/index";
import { useNavigate } from "react-router-dom";

function UserManagerHomePage() {
  document.title = "User Manager Home";

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [facultySmart, setFacultySmart] = useState({
    course: [],
    semester: [],
    subject: [],
    division: [],
  });

  useEffect(() => {
    if (!user?.userManager || user?.userManager.role !== "userManager") {
      sessionStorage.clear();
      navigate("/userManager/login");
    }
  }, [user, navigate]);

  // ✅ PREMIUM ADD USER (ARRAY SAFE)
  const handleAddUser = async (newUser, userAPI, userDetails) => {
    if (!userDetails || Object.keys(userDetails).length === 0) {
      return { success: false, message: "Empty row" };
    }

    userDetails.role = userAPI === "students" ? "student" : "faculty";

    // 🔥 FACULTY ARRAY SUPPORT
    if (userAPI === "faculties") {
      userDetails.course = facultySmart.course;
      userDetails.semester = facultySmart.semester;
      userDetails.subject = facultySmart.subject;
      userDetails.division = facultySmart.division;
    }

    if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
      return { success: false, message: "Invalid email" };
    }

    if (userDetails.enrollmentnumber) {
      userDetails.enrollmentNumber = String(userDetails.enrollmentnumber);
      delete userDetails.enrollmentnumber;
    }

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
      return { success: false, message: "Network error: " + err.message };
    }
  };

  const handleEdit = async (user, type) => {
    const res = await fetch(`http://localhost:3000/${type}/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!res.ok) throw new Error("Failed to update");
    return await res.json();
  };

  const handleDelete = async (user, type) => {
    const res = await fetch(`http://localhost:3000/${type}/${user._id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete");
    return true;
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#C4B5FD] to-[#8B5CF6]">
      <div className="flex flex-col h-full">
        <Header
          textColor="text-[#0EA5E9]"
          headerStyle="to-[#C4B5FD] from-[#A37BFFFF]"
          menuLinks={[
            { name: "Home", href: "/userManager" },
            { name: "User List", href: "#userList" },
            { name: "Add User", href: "#addUsers" },
          ]}
          wantSearch={false}
          dummyReports={[]}
          profileNavigate="/userManager/profile"
          loginPage="/userManager/login"
        />

        <Hero
          user={user.userManager}
          userRole={"User Manager"}
          userObjectName="userManager"
          heroImg="user_manager_hero.jpg"
          heroBgColor="to-[#A37BFFFF] from-[#C4B5FD]"
        />

        {/* USERS */}
        <div id="userList">
          <List
            entityNames={["Students", "Faculties"]}
            entityFields={[
              [
                "Enrollment No",
                "Name",
                "Email",
                "Course",
                "Division",
                "Semester",
              ],
              ["Name", "Email", "Subject", "Course", "Semester", "Division"],
            ]}
            entityKeys={[
              [
                "enrollmentNumber",
                "name",
                "email",
                "course",
                "division",
                "semester",
              ],
              ["name", "email", "subject", "course", "semester", "division"],
            ]}
            entityEndpoints={["students", "faculties"]}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        </div>

        {/* ADD USERS */}
        <div id="addUsers">
          <AddUsers
            currentRole={"User Manager"}
            userToAdd={["Students", "Faculties"]}
            userDataBaseEntry={{
              Students: [
                { field: "enrollmentNumber", type: "number" },
                { field: "name", type: "text" },
                { field: "email", type: "email" },
                { field: "yearOfJoining", type: "text" },
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
      </div>
    </div>
  );
}

export default UserManagerHomePage;
