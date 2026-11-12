import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/");
    } catch (err) { setError("Неверный email или пароль"); }
  };

  return (
    <div className="card">
      <h2>Вход</h2>
      {error && <p style={{ color: "#e74c3c", textAlign: "center" }}>{error}</p>}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" placeholder="Пароль" onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit">Войти</button>
      </form>
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Нет аккаунта? <Link to="/register" style={{ color: "#8e44ad" }}>Зарегистрироваться</Link>
      </p>
    </div>
  );
}