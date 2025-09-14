const Faculty = require("../Models/faculties");

// Create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    const faculty = new Faculty(req.body);
    await faculty.save();
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all faculties
exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No faculties found" });
    res.status(500).json({ message: error.message });
  }
};

// Get a faculty by ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No faculty found" });
    res.status(500).json({ message: error.message });
  }
};

// Get a faculty by email
exports.getFacultyByEmail = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ email: req.params.email });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No faculty found" });
    res.status(500).json({ message: error.message });
  }
};

// Update a faculty by ID
exports.updateFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No faculty found" });
    res.status(500).json({ message: error.message });
  }
};

// Update a faculty by email
exports.updateFacultyByEmail = async (req, res) => {
  try {
    const faculty = await Faculty.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No faculty found" });
    res.status(500).json({ message: error.message });
  }
};

// Delete a faculty by ID
exports.deleteFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndDelete(req.params.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No faculty found" });
    res.status(500).json({ message: error.message });
  }
};

// Delete a faculty by email
exports.deleteFacultyByEmail = async (req, res) => {
  try {
    const faculty = await Faculty.findOneAndDelete({ email: req.params.email });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
    res.status(404).json({ message: "No faculty found" });
    res.status(500).json({ message: error.message });
  }
};
