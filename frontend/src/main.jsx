import {
  StudentLogin,
  FacultyLogin,
  StudentForgetPassword,
  FacultyForgetPassword,
  UserManagerLogin,
  UserManagerForgetPassword,
  LibraryManagerLogin,
  LibraryManagerForgetPassword,
  AdminLogin,
  AdminForgetPassword,
  StudentHomePage,
  AdminHomePage,
  UserManagerHomePage,
  UserManagerProfile,
  LibraryManagerHomePage,
  LibraryManagerProfile,
  AdminProfile,
  FacultiesHomePage,
} from "./pages/index.js";
import { createRoot } from "react-dom/client";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<StudentLogin />} />
      <Route path="faculty-login" element={<FacultyLogin />} />
      <Route path="user-manager-login" element={<UserManagerLogin />} />
      <Route path="library-manager-login" element={<LibraryManagerLogin />} />

      <Route
        path="student-forget-password"
        element={<StudentForgetPassword />}
      />
      <Route
        path="faculty-forget-password"
        element={<FacultyForgetPassword />}
      />
      <Route
        path="user-manager-forget-password"
        element={<UserManagerForgetPassword />}
      />
      <Route
        path="library-manager-forget-password"
        element={<LibraryManagerForgetPassword />}
      />
      <Route path="admin-forget-password" element={<AdminForgetPassword />} />
      <Route path="admin-login" element={<AdminLogin />} />

      <Route path="student-home" element={<StudentHomePage />} />
      <Route path="faculties-home" element={<FacultiesHomePage />} />
      <Route path="admin-home" element={<AdminHomePage />} />
      <Route path="user-manager-home" element={<UserManagerHomePage />} />
      <Route path="library-manager-home" element={<LibraryManagerHomePage />} />

      <Route path="user-manager-profile" element={<UserManagerProfile />} />
      <Route
        path="library-manager-profile"
        element={<LibraryManagerProfile />}
      />
      <Route path="admin-profile" element={<AdminProfile />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
