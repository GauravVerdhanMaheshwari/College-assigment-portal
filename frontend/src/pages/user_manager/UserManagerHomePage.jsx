import React, { useEffect } from "react";
import { Header, Hero, List, AddUsers } from "../../components/index";
import { useNavigate } from "react-router-dom";

function UserManagerHomePage() {
  document.title = "User Manager Home";

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [status, setStatus] = React.useState({
    loading: false,
    success: "",
    error: "",
  });
  const [uploadSummary, setUploadSummary] = React.useState(null);

  useEffect(() => {
    if (!user?.userManager) {
      sessionStorage.clear();
      console.log("No user logged in");
      navigate("/userManager/login");
    }

    if (user?.userManager.role !== "userManager") {
      sessionStorage.clear();
      console.log("User is not a User Manager");
      navigate("/userManager/login");
    }
  }, [user, navigate]);

  const handleAddUser = async (newUser, userAPI, userDetails) => {
    if (!userDetails || Object.keys(userDetails).length === 0) {
      return { success: false, message: "Empty row" };
    }

    // 🔐 AUTO ROLE
    userDetails.role = userAPI === "students" ? "student" : "faculty";

    // Email validation
    if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
      return { success: false, message: "Invalid email" };
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
      return { success: false, message: "Network error" };
    }
  };

  const handleEdit = async (user, type) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${type}/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const data = await response.json();
      alert(`${user.name} updated successfully!`);
      return data; // return updated user so List can update state
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to update ${user.name}. Please try again.`);
      throw error;
    }
  };

  const handleDelete = async (user, type) => {
    const ok = window.confirm(`Are you sure you want to delete ${user.name}?`);
    if (!ok) return;

    try {
      const response = await fetch(
        `http://localhost:3000/${type}/${user._id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await response.json();
      alert(`${user.name} deleted successfully!`);
      return true; // return success so List can update state
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to delete ${user.name}. Please try again.`);
      throw error;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#C4B5FD] to-[#8B5CF6]">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <Header
            textColor="text-[#0EA5E9] text-shadow-[0_0_10px_rgba(14,165,233,0.5)]"
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
        </div>

        <div className="mb-10">
          <Hero
            user={user.userManager}
            userRole={"User Manager"}
            userObjectName="userManager"
            heroImg="user_manager_hero.jpg"
            heroBgColor="to-[#A37BFFFF] from-[#C4B5FD]"
          />
        </div>

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

        <div id="addUsers">
          <AddUsers
            userToAdd={["Students", "Faculties"]}
            userDataBaseEntry={{
              Students: [
                { field: "enrollmentNumber", type: "number" },
                { field: "name", type: "text" },
                { field: "email", type: "email" },
                { field: "course", type: "text" },
                { field: "division", type: "text" },
                { field: "semester", type: "number" },
              ],
              Faculties: [
                { field: "name", type: "text" },
                { field: "email", type: "email" },
                { field: "subject", type: "text" },
                { field: "course", type: "text" },
                { field: "semester", type: "number" },
                { field: "division", type: "text" },
              ],
            }}
            handleAddUser={handleAddUser}
          />
          {(status.loading || status.success || status.error) && (
            <div className="mx-20 mb-4">
              {status.loading && (
                <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
                  ⏳ Processing request...
                </div>
              )}

              {status.success && (
                <div className="p-3 bg-green-100 text-green-800 rounded">
                  ✅ {status.success}
                </div>
              )}

              {status.error && (
                <div className="p-3 bg-red-100 text-red-800 rounded">
                  ❌ {status.error}
                </div>
              )}
            </div>
          )}
          {uploadSummary && (
            <div className="mx-20 mb-6 p-4 rounded bg-white shadow">
              <h3 className="text-lg font-bold mb-2">📊 Upload Summary</h3>

              <p>📁 Total Rows: {uploadSummary.total}</p>
              <p className="text-green-600">
                ✅ Success: {uploadSummary.success}
              </p>
              <p className="text-red-600">❌ Failed: {uploadSummary.failed}</p>

              {uploadSummary.errors.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold mb-1">Failed Rows:</h4>
                  <ul className="text-sm text-red-700 list-disc pl-5">
                    {uploadSummary.errors.map((err, index) => (
                      <li key={index}>
                        Row {err.row}: {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagerHomePage;
