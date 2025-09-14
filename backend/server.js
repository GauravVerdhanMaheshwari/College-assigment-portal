const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/CollegeProjectPaperManagementSystem"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});
app.use(cors());

app.use(express.json());

// Import and use student routes
app.use("/students", require("./Routers/studentRoute"));
// Import and use faculty routes
app.use("/faculties", require("./Routers/facultiesRoute"));
// Import and use user manager routes
app.use("/user-managers", require("./Routers/user_managerRoute"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
