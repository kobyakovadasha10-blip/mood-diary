import { useEffect, useState } from "react";
import api from "../api";

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ date: "", mood: 3, note: "" });
  const [filterMood, setFilterMood] = useState("");

  const load = async () => {
    try {
      let url = "/entries";
      if (filterMood) url += `?mood=${filterMood}`;
      const res = await api.get(url);
      setEntries(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { load(); }, [filterMood]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/entries", form);
      setForm({ date: "", mood: 3, note: "" });
      load();
    } catch (err) { alert("Ошибка при добавлении. Проверь, запущен ли сервер!"); }
  };

  const remove = async (id) => {
    if (!confirm("Удалить запись?")) return;
    try {
      await api.delete(`/entries/${id}`);
      load();
    } catch (err) { alert("Ошибка при удалении"); }
  };

  const total = entries.length;
  const avgMood = total > 0 ? (entries.reduce((acc, curr) => acc + curr.mood, 0) / total).toFixed(1) : 0;
  const goodDays = entries.filter(e => e.mood >= 4).length;

  let quote = "Добавь свою первую запись, чтобы отслеживать настроение!";
  if (total > 0) {
    if (avgMood >= 4) quote = "✨ Отличная динамика! Ты на позитиве, так держать!";
    else if (avgMood >= 2.5) quote = "😌 Жизнь — это полосы. Сегодня нормально, завтра будет еще лучше.";
    else quote = "🫂 Похоже, неделя была тяжелой. Отдохни и побудь с собой, всё наладится.";
  }

  const getMoodColor = (mood) => {
    if (mood >= 4) return "#27ae60";
    if (mood === 3) return "#f1c40f";
    return "#e74c3c";
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px", textAlign: "center", fontStyle: "italic", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", color: "#4a235a" }}>
        <h3 style={{ margin: 0 }}>{quote}</h3>
      </div>

      <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, background: "white", padding: "15px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>Всего записей</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8e44ad" }}>{total}</div>
        </div>
        <div style={{ flex: 1, background: "white", padding: "15px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>Среднее настроение</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#e67e22" }}>{avgMood}</div>
        </div>
        <div style={{ flex: 1, background: "white", padding: "15px", borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: "14px", color: "#666", fontWeight: "bold" }}>Хороших дней</div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#27ae60" }}>{goodDays}</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: "100%", marginBottom: "30px", marginTop: "0" }}>
        <h2>Новая запись</h2>
        <form onSubmit={submit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
          <select value={form.mood} onChange={e => setForm({...form, mood: Number(e.target.value)})}>
            <option value={1}>😞 1</option><option value={2}>😕 2</option><option value={3}>😐 3</option>
            <option value={4}>🙂 4</option><option value={5}>😄 5</option>
          </select>
          <input placeholder="О чем думаешь?" value={form.note} onChange={e => setForm({...form, note: e.target.value})} style={{ flex: 1 }} />
          <button type="submit">Добавить</button>
        </form>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, color: "#4a235a" }}>Мои записи</h3>
        <div>
          <label style={{ marginRight: "10px", color: "#666", fontWeight: "bold" }}>Фильтр:</label>
          <select value={filterMood} onChange={e => setFilterMood(e.target.value)}>
            <option value="">Все</option>
            <option value="5">😄 Отличные</option>
            <option value="4">🙂 Хорошие</option>
            <option value="3">😐 Нормальные</option>
            <option value="2">😕 Плохие</option>
            <option value="1">😞 Ужасные</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {entries.length === 0 && <p style={{ textAlign: "center", color: "#666" }}>Записей нет...</p>}
        
        {entries.map(e => (
          <div key={e.id} style={{ 
            background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderLeft: `6px solid ${getMoodColor(e.mood)}`,
            transition: "transform 0.2s, box-shadow 0.2s", cursor: "default"
          }}
          onMouseEnter={(el) => { el.currentTarget.style.transform = "translateX(5px)"; el.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }}
          onMouseLeave={(el) => { el.currentTarget.style.transform = "translateX(0)"; el.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)"; }}
          >
            <div>
              <span style={{ fontSize: "28px", marginRight: "15px", verticalAlign: "middle" }}>
                {e.mood === 1 ? "😞" : e.mood === 2 ? "😕" : e.mood === 3 ? "😐" : e.mood === 4 ? "🙂" : "😄"}
              </span>
              <b style={{ color: "#8e44ad", fontSize: "18px" }}>{e.date}</b>
              <span style={{ marginLeft: "15px", color: "#555", fontSize: "16px" }}>{e.note || "Без заметки"}</span>
            </div>
            <button onClick={() => remove(e.id)} style={{ background: "#e74c3c", padding: "8px 12px", borderRadius: "8px" }}>Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}