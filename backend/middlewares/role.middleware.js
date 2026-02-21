// ROLE BASED ACCESS CONTROL

export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
