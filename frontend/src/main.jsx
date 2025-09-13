import {
  StudentLogin,
  FacultyLogin,
  StudentForgetPassword,
  FacultyForgetPassword,
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
      <Route
        path="student-forget-password"
        element={<StudentForgetPassword />}
      />
      <Route
        path="faculty-forget-password"
        element={<FacultyForgetPassword />}
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
