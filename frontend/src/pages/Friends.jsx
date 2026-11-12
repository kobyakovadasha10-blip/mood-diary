import { useEffect, useState } from "react";
import api from "../api";

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  
  // Состояния для просмотра записей друга
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendEntries, setFriendEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const load = async () => {
    try {
      const res = await api.get("/friends");
      setFriends(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { load(); }, []);

  const addFriend = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    try {
      await api.post("/friends", { friend_email: email });
      setMsg("Друг успешно добавлен!");
      setEmail("");
      load();
    } catch (err) { 
      setError(err.response?.data?.detail || "Ошибка добавления"); 
    }
  };

  // Функция просмотра записей друга
  const viewFriend = async (friend) => {
    setSelectedFriend(friend);
    setLoadingEntries(true);
    try {
      const res = await api.get(`/friends/${friend.id}/entries`);
      setFriendEntries(res.data);
    } catch (err) {
      alert("Не удалось загрузить записи");
    } finally {
      setLoadingEntries(false);
    }
  };

  const closeView = () => {
    setSelectedFriend(null);
    setFriendEntries([]);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      
      {/* Если выбран друг — показываем его записи */}
      {selectedFriend ? (
        <div style={{ background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          <button onClick={closeView} style={{ marginBottom: "20px", background: "#666" }}>← Назад к друзьям</button>
          <h2>Записи пользователя: {selectedFriend.full_name}</h2>
          
          {loadingEntries ? (
            <p>Загрузка...</p>
          ) : friendEntries.length === 0 ? (
            <p>У этого пользователя пока нет записей.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {friendEntries.map(e => (
                <div key={e.id} style={{ 
                  padding: "15px", borderRadius: "10px", background: "#f8f9fa",
                  borderLeft: `5px solid ${e.mood >= 4 ? "#27ae60" : e.mood === 3 ? "#f1c40f" : "#e74c3c"}`
                }}>
                  <span style={{ fontSize: "24px", marginRight: "10px" }}>
                    {e.mood === 1 ? "😞" : e.mood === 2 ? "😕" : e.mood === 3 ? "😐" : e.mood === 4 ? "🙂" : "😄"}
                  </span>
                  <b>{e.date}</b> — <span style={{ color: "#555" }}>{e.note || "Без заметки"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Если друг не выбран — показываем список друзей */
        <div className="card" style={{ maxWidth: "600px" }}>
          <h2>Мои друзья</h2>
          
          <form onSubmit={addFriend} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input type="email" placeholder="Email друга" value={email} onChange={e => setEmail(e.target.value)} required style={{ flex: 1 }} />
            <button type="submit">Добавить</button>
          </form>
          {error && <p style={{ color: "#e74c3c" }}>{error}</p>}
          {msg && <p style={{ color: "#27ae60" }}>{msg}</p>}

          <ul style={{ listStyle: "none", padding: 0 }}>
            {friends.length === 0 && <p style={{ textAlign: "center" }}>У вас пока нет друзей.</p>}
            {friends.map(f => (
              <li key={f.id} style={{ 
                padding: "15px", background: "#f8f9fa", borderRadius: "8px", 
                marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div>
                  <b>{f.full_name}</b> <br/> <span style={{ color: "#666", fontSize: "14px" }}>{f.email}</span>
                </div>
                <button onClick={() => viewFriend(f)} style={{ padding: "8px 15px" }}>
                  Смотреть записи
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}