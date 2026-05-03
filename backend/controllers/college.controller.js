import College from "../models/College.js";

// GET /api/college
// Public route to list all active colleges for registration
export const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({ status: "active" })
      .select("name code domain")
      .sort({ name: 1 });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/college/:id
export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/college
// Superadmin/Platform owner route to create a new college
export const createCollege = async (req, res) => {
  try {
    const { name, code, domain } = req.body;
    
    const existing = await College.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "College code already exists" });
    }

    const college = await College.create({
      name,
      code: code.toUpperCase(),
      domain,
      status: "active"
    });

    res.status(201).json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
