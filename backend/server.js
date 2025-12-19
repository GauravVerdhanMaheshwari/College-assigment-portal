const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { connectGridFS } = require("./config/gridfs");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/CollegeProjectPaperManagementSystem"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  connectGridFS();
});

// Import and use student routes
app.use("/students", require("./Routers/studentRoute"));
// Import and use faculty routes
app.use("/faculties", require("./Routers/facultiesRoute"));
// Import and use user manager routes
app.use("/user-managers", require("./Routers/user_managerRoute"));
// Import and use library manager routes
app.use("/library-managers", require("./Routers/library_managerRoute"));
// Import and use admin routes
app.use("/admins", require("./Routers/adminRoute"));
// Import and use assignment routes
app.use("/assignments", require("./Routers/assignmentRoute"));
// Import and use paper routes
app.use("/papers", require("./Routers/paperRoute"));
// Import and use access control routes
app.use("/access-control", require("./Routers/access_controlRoute"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
