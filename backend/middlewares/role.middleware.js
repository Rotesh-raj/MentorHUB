export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `403 Access Denied: Requires one of these roles: ${roles.join(", ")}.`
      });
    }
    next();
  };
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "403 Access Denied: Requires SuperAdmin role." });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "403 Access Denied: Requires Admin role." });
  }
};

export const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === "teacher") {
    next();
  } else {
    res.status(403).json({ message: "403 Access Denied: Requires Teacher role." });
  }
};

export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({ message: "403 Access Denied: Requires Student role." });
  }
};

export const sameCollegeOnly = (req, res, next) => {
  // If request contains target collegeId in body, params, or query
  const targetCollegeId = req.body.collegeId || req.params.collegeId || req.query.collegeId;
  
  if (targetCollegeId && req.user.collegeId.toString() !== targetCollegeId.toString()) {
    return res.status(403).json({ message: "403 Access Denied: Cross-college access forbidden." });
  }
  next();
};

export const sameDepartmentOnly = (req, res, next) => {
  // If request contains target department
  const targetDepartment = req.body.department || req.params.department || req.query.department;
  
  if (targetDepartment && req.user.department !== targetDepartment) {
    return res.status(403).json({ message: "403 Access Denied: Cross-department access forbidden." });
  }
  next();
};
