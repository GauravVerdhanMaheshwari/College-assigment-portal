const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb://localhost:27017/CollegeProjectPaperManagementSystem",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.use(express.json());

// Import and use student routes
app.use("/students", require("./Routers/studentRoute"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
