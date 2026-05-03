import bcrypt from "bcryptjs";

const password = "Admin@123"; // SuperAdmin password as per task spec

bcrypt.hash(password, 10).then((hash) => {
  console.log("Hashed Password for SuperAdmin:");
  console.log(hash);
  console.log("\nLogin credentials:");
  console.log("Email: superadmin@gmail.com");
  console.log("Password: Admin@123");
});

