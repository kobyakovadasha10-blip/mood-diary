import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({ email: "", full_name: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", form);
      alert("Аккаунт создан! Теперь войди.");
      navigate("/login");
    } catch (err) { setError("Ошибка регистрации"); }
  };

  return (
    <div className="card">
      <h2>Регистрация</h2>
      {error && <p style={{ color: "#e74c3c", textAlign: "center" }}>{error}</p>}
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="email" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="ФИО" onChange={e => setForm({...form, full_name: e.target.value})} required />
        <input type="password" placeholder="Пароль (мин. 6 символов)" onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Уже есть аккаунт? <Link to="/login" style={{ color: "#8e44ad" }}>Войти</Link>
      </p>
    </div>
  );
}