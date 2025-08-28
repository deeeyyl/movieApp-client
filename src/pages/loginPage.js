import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/userContext";

function LoginPage() {
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Login failed: ${res.status} - ${text}`);
      }

      const data = await res.json();

      if (data.access) {
        localStorage.setItem("token", data.access);

        // Update user in context immediately
        const payload = JSON.parse(atob(data.access.split(".")[1]));
        setUser({
          email: payload.email,
          isAdmin: payload.isAdmin || payload.isAdmin === true || payload.isAdmin === "true",
        });

        setMessage("Login successful!");
        navigate("/movies");
      } else {
        setMessage("Unable to login at this time");
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginPage;