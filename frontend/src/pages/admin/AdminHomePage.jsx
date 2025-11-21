import React, { useEffect } from "react";
import {
  Header,
  Hero,
  List,
  AddUsers,
  PapersList,
} from "../../components/index";
import { useNavigate } from "react-router-dom";

function AdminHomePage() {
  document.title = "Admin Home";
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

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

  // 📌 ADD USERS
  const handleAddUser = (newUser, userAPI, userDetails) => {
    if (!userDetails || Object.keys(userDetails).length === 0) {
      alert("Please fill in the user details.");
      return;
    }
    if (!userAPI) {
      alert("Invalid user type.");
      return;
    }

    // validate email
    if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // generate default password
    userDetails.password = userDetails.name + "@123";

    fetch(`http://localhost:3000/${userAPI}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userDetails),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json().catch(() => null);
      })
      .then(() => alert(`${newUser} added successfully!`))
      .catch(() => alert(`Failed to add ${newUser}. Please try again.`));
  };

  // 📌 EDIT
  const handleEdit = async (entity, type) => {
    try {
      const res = await fetch(`http://localhost:3000/${type}/${entity._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entity),
      });
      if (!res.ok) throw new Error("Failed to update");
      alert(`${entity.name || entity.title} updated successfully!`);
      return await res.json();
    } catch (err) {
      console.error(err);
      alert("Error updating. Try again.");
      throw err;
    }
  };

  // 📌 DELETE
  const handleDelete = async (entity, type) => {
    const ok = window.confirm(
      `Are you sure you want to delete ${entity.name || entity.title}?`
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
      alert("Error deleting. Try again.");
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
            user={user}
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
              ["Enrollment No", "Name", "Email", "Course", "Division", "Year"],
              ["Name", "Email", "Subject", "Course", "Year", "Division"],
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
                "year",
              ],
              ["name", "email", "subject", "course", "year", "division"],
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
                { field: "course", type: "text" },
                { field: "division", type: "text" },
                { field: "year", type: "number" },
              ],
              Faculties: [
                { field: "name", type: "text" },
                { field: "email", type: "email" },
                { field: "subject", type: "text" },
                { field: "course", type: "text" },
                { field: "year", type: "number" },
                { field: "division", type: "text" },
              ],
            }}
            handleAddUser={handleAddUser}
          />
        </div>

        {/* PAPERS LIST */}
        <div id="papersList" className="mt-10">
          <PapersList
            papers={[]} // fetch from API later
            textCSS="text-[#4D7BFAFF] text-shadow-[0_0_10px_rgba(30,58,138,0.5)]"
            buttonCSS="bg-[#3B96FFFF] hover:bg-[#55A3FCFF] hover:shadow-[4px_4px_16px_1px_rgba(7,59,76,0.4)] text-white"
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
