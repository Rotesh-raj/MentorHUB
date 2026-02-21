export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateUSN = (usn) => {
  // Example USN format: 1XX21CS000
  const re = /^[0-9A-Z]{10}$/;
  return re.test(usn);
};

export const validateStaffId = (staffId) => {
  // Example Staff ID format: STAFF001
  const re = /^[A-Z0-9]+$/;
  return re.test(staffId);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
