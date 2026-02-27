import React, { useEffect } from "react";
import { Header, Hero, List, AddUsers } from "../../components/index";
import { useNavigate } from "react-router-dom";

function UserManagerHomePage() {
  document.title = "User Manager Home";

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user?.userManager || user?.userManager.role !== "userManager") {
      sessionStorage.clear();
      navigate("/userManager/login");
    }
  }, [user, navigate]);

  const isValidEmail = (email) => {
    if (!email || typeof email !== "string") return false;

    // strong but practical regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  };

  // ✅ PREMIUM ADD USER (ARRAY SAFE)
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
                "Year of Joining",
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
                "yearOfJoining",
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
