import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Entries from "./pages/Entries";
import Friends from "./pages/Friends";

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const logout = () => { 
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <div>
      <nav style={{ 
        padding: "15px 30px", 
        background: "rgba(255, 255, 255, 0.95)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ margin: 0, color: "#8e44ad" }}>✨ Дневник настроения</h2>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {!token && <Link to="/login" style={{ color: "#8e44ad", textDecoration: "none", fontWeight: "bold" }}>Вход</Link>}
          {!token && <Link to="/register" style={{ color: "#8e44ad", textDecoration: "none", fontWeight: "bold" }}>Регистрация</Link>}
          
          {token && <Link to="/" style={{ color: "#8e44ad", textDecoration: "none", fontWeight: "bold" }}>Мои записи</Link>}
          {token && <Link to="/friends" style={{ color: "#8e44ad", textDecoration: "none", fontWeight: "bold" }}>Друзья</Link>}
          
          {token && <button onClick={logout} style={{ padding: "8px 15px", fontSize: "14px" }}>Выйти</button>}
        </div>
      </nav>
      
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Entries /></PrivateRoute>} />
          <Route path="/friends" element={<PrivateRoute><Friends /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}