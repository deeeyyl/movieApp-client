import { useState } from "react";
import LoginPage from "./loginPage";
import RegisterPage from "./registerPage";

function HomePage() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🎬 Welcome to Movie App</h1>

      {/* Tab Switcher */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("login")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            background: activeTab === "login" ? "#007bff" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          style={{
            padding: "10px 20px",
            background: activeTab === "register" ? "#28a745" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>

      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {activeTab === "login" ? <LoginPage /> : <RegisterPage />}
      </div>
    </div>
  );
}

export default HomePage;