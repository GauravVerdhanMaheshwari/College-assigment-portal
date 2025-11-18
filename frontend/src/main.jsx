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
  FacultiesProfile,
  StudentProfile,
  PageNotFound,
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
      {/* Login Routes */}
      <Route index element={<StudentLogin />} />
      <Route path="faculties/login" element={<FacultyLogin />} />
      <Route path="userManager/login" element={<UserManagerLogin />} />
      <Route path="libraryManager/login" element={<LibraryManagerLogin />} />
      <Route path="admin/login" element={<AdminLogin />} />
      {/* Forget Password Routes */}
      <Route
        path="student/forgetPassword"
        element={<StudentForgetPassword />}
      />
      <Route
        path="faculties/forgetPassword"
        element={<FacultyForgetPassword />}
      />
      <Route
        path="userManager/forgetPassword"
        element={<UserManagerForgetPassword />}
      />
      <Route
        path="libraryManager/forgetPassword"
        element={<LibraryManagerForgetPassword />}
      />
      <Route path="admin/forgetPassword" element={<AdminForgetPassword />} />
      {/* Home Routes */}
      <Route path="student" element={<StudentHomePage />} />
      <Route path="faculties" element={<FacultiesHomePage />} />
      <Route path="admin" element={<AdminHomePage />} />
      <Route path="userManager" element={<UserManagerHomePage />} />
      <Route path="libraryManager" element={<LibraryManagerHomePage />} />
      {/* Profile Routes */}
      <Route path="userManager/profile" element={<UserManagerProfile />} />
      <Route
        path="libraryManager/profile"
        element={<LibraryManagerProfile />}
      />
      <Route path="admin/profile" element={<AdminProfile />} />
      <Route path="faculties/profile" element={<FacultiesProfile />} />
      <Route path="student/profile" element={<StudentProfile />} />

      {/* Fallback Route */}
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
