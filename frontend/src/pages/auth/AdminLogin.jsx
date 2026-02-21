import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth(); // use context login
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const user = await login(email, password);

      if (user.role !== "admin") {
        alert("Not an admin account");
        return;
      }

      navigate("/admin");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 shadow rounded w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>

        <input
          className="border p-2 w-full"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
