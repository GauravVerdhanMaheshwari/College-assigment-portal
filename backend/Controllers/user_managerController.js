const UserManager = require("../Models/user_manager");

// Create a new user manager
exports.createUserManager = async (req, res) => {
  try {
    const userManager = new UserManager(req.body);
    await userManager.save();
    res.status(201).json(userManager);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all user managers
exports.getAllUserManagers = async (req, res) => {
  try {
    const userManagers = await UserManager.find();
    res.status(200).json(userManagers);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No user managers found" });
    res.status(500).json({ message: error.message });
  }
};

// Get a user manager by ID
exports.getUserManagerById = async (req, res) => {
  try {
    const userManager = await UserManager.findById(req.params.id);
    if (!userManager) {
      return res.status(404).json({ message: "User Manager not found" });
    }
    res.status(200).json(userManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user manager by email
exports.getUserManagerByEmail = async (req, res) => {
  try {
    const userManager = await UserManager.findOne({ email: req.params.email });
    if (!userManager) {
      return res.status(404).json({ message: "User Manager not found" });
    }
    res.status(200).json(userManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user manager by ID
exports.updateUserManager = async (req, res) => {
  try {
    const userManager = await UserManager.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!userManager) {
      return res.status(404).json({ message: "User Manager not found" });
    }
    res.status(200).json(userManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a user manager by email
exports.updateUserManagerByEmail = async (req, res) => {
  try {
    const userManager = await UserManager.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    if (!userManager) {
      return res.status(404).json({ message: "User Manager not found" });
    }
    res.status(200).json(userManager);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user manager by ID
exports.deleteUserManager = async (req, res) => {
  try {
    const userManager = await UserManager.findByIdAndDelete(req.params.id);
    if (!userManager) {
      return res.status(404).json({ message: "User Manager not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user manager
exports.loginUserManager = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userManager = await UserManager.findOne({ email, password });
    if (!userManager) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ userManager });
  } catch (error) {
    console.log(res.status);
    res.status(500).json({ message: error.message });
  }
};
