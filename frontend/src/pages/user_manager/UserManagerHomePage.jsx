import React, { useEffect } from "react";
import { Header, Hero, List, AddUsers } from "../../components/index";
import { useNavigate } from "react-router-dom";

function UserManagerHomePage() {
  document.title = "User Manager Home";

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      sessionStorage.clear();
      console.log("No user logged in");
      navigate("/userManager/login");
    }

    if (user?.role !== "userManager") {
      sessionStorage.clear();
      console.log("User is not a User Manager");
      navigate("/userManager/login");
    }
  }, [user, navigate]);

  const dummyReports = [
    {
      id: 1,
      userName: "John Doe",
      userEmail: "john@example.com",
      message: "Reported inappropriate behavior",
    },
    {
      id: 2,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      message: "Reported missing submission",
    },
    {
      id: 3,
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      message: "Reported missing submission",
    },
  ];

  const handleAddUser = (newUser, userAPI, userDetails) => {
    if (!userDetails || Object.keys(userDetails).length === 0) {
      alert("Please fill in the user details.");
      return;
    }
    if (!userAPI) {
      alert("Invalid user type.");
      return;
    }
    if (userDetails.email && !/\S+@\S+\.\S+/.test(userDetails.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (userDetails.year) {
      const year = parseInt(userDetails.year, 10);
      if (isNaN(year) || year < 1 || year > 5) {
        alert("Please enter a valid year (1-5).");
        return;
      }
      userDetails.year = year;
    }
    if (userDetails.enrollmentNumber) {
      const enrollmentNumber = parseInt(userDetails.enrollmentNumber, 10);
      if (isNaN(enrollmentNumber) || enrollmentNumber <= 0) {
        alert("Please enter a valid enrollment number.");
        return;
      }
      userDetails.enrollmentNumber = enrollmentNumber;
    }

    userDetails.password = userDetails.name + "@" + userDetails.year;

    userDetails.course = userDetails.course.toUpperCase();
    userDetails.division = userDetails.division.toUpperCase();

    fetch(`http://localhost:3000/${userAPI}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) return null;
        return response.json().catch(() => null);
      })
      .then((data) => {
        console.log("Success:", data);
        alert(`${newUser} added successfully!`);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(`Failed to add ${newUser}. Please try again.`);
      });
  };

  const handleEdit = async (user, type) => {
    try {
      const response = await fetch(
        `http://localhost:3000/${type}/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
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
        }
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

  console.log(user);

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
            dummyReports={dummyReports}
            profileNavigate="/userManager/profile"
            loginPage="/userManager/login"
          />
        </div>

        <div className="mb-10">
          <Hero
            user={user}
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
              ["Enrollment No", "Name", "Email", "Course", "Division", "Year"],
              ["Name", "Email", "Subject", "Course", "Year", "Division"],
            ]}
            entityKeys={[
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
      </div>
    </div>
  );
}

export default UserManagerHomePage;
