const LibraryManager = require("../Models/library_manager");

// Create a new library manager
exports.createLibraryManager = async (req, res) => {
  try {
    const libraryManager = new LibraryManager(req.body);
    await libraryManager.save();
    res.status(201).json(libraryManager);
  } catch (error) {
    res.status(500).json({ error: "Failed to create library manager" });
  }
};

// Get all library managers
exports.getAllLibraryManagers = async (req, res) => {
  try {
    const libraryManagers = await LibraryManager.find();
    res.status(200).json(libraryManagers);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve library managers" });
  }
};

// Get a library manager by ID
exports.getLibraryManagerById = async (req, res) => {
  try {
    const libraryManager = await LibraryManager.findById(req.params.id);
    if (!libraryManager) {
      return res.status(404).json({ error: "Library manager not found" });
    }
    res.status(200).json(libraryManager);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve library manager" });
  }
};

// Get a library manager by email
exports.getLibraryManagerByEmail = async (req, res) => {
  try {
    const libraryManager = await LibraryManager.findOne({
      email: req.params.email,
    });
    if (!libraryManager) {
      return res.status(404).json({ error: "Library manager not found" });
    }
    res.status(200).json(libraryManager);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve library manager" });
  }
};

// Update a library manager by ID
exports.updateLibraryManagerById = async (req, res) => {
  try {
    const libraryManager = await LibraryManager.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!libraryManager) {
      return res.status(404).json({ error: "Library manager not found" });
    }
    res.status(200).json(libraryManager);
  } catch (error) {
    res.status(500).json({ error: "Failed to update library manager" });
  }
};

// Delete a library manager by ID
exports.deleteLibraryManagerById = async (req, res) => {
  try {
    const libraryManager = await LibraryManager.findByIdAndDelete(
      req.params.id
    );
    if (!libraryManager) {
      return res.status(404).json({ error: "Library manager not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete library manager" });
  }
};

// Delete a library manager by email
exports.deleteLibraryManagerByEmail = async (req, res) => {
  try {
    const libraryManager = await LibraryManager.findOneAndDelete({
      email: req.params.email,
    });
    if (!libraryManager) {
      return res.status(404).json({ error: "Library manager not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete library manager" });
  }
};

//Check login credentials
exports.checkLoginCredentials = async (req, res) => {
  try {
    const { email, password } = req.body;
    const libraryManager = await LibraryManager.findOne({ email, password });
    if (!libraryManager) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ libraryManager });
  } catch (error) {
    res.status(500).json({ error: "Failed to process login" });
  }
};
