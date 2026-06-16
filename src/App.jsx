import { useState, useEffect } from "react";

const MASTERS = ["ХУДОЁР"];
const SERVICES = [
  { name: "Стрижка", price: 20, duration: 30 },
  { name: "Стрижка + борода", price: 35, duration: 50 },
  { name: "Борода", price: 15, duration: 20 },
  { name: "Детская стрижка", price: 15, duration: 25 },
  { name: "Укладка", price: 10, duration: 15 },
];

const TIMES = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30",
  "13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00","19:30","20:00"];

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => new Date(d).toLocaleDateString("ru-RU", { day:"2-digit", month:"short" });
const fmtTime = (t) => t;

function generateId() { return Math.random().toString(36).slice(2, 9); }

const INITIAL_BOOKINGS = [
  { id: generateId(), client: "Акбар Рахимов", phone: "+992 900 000 001", master: "Алишер", service: "Стрижка", price: 20, date: today(), time: "10:00", status: "confirmed" },
  { id: generateId(), client: "Санжар Камолов", phone: "+992 900 000 002", master: "Баходур", service: "Стрижка + борода", price: 35, date: today(), time: "12:00", status: "confirmed" },
  { id: generateId(), client: "Давлат Юсупов", phone: "+992 900 000 003", master: "Фирдавс", service: "Борода", price: 15, date: today(), time: "14:30", status: "pending" },
];

const INITIAL_EXPENSES = [
  { id: generateId(), label: "Шампунь Wahl", amount: 25, date: today(), type: "expense" },
  { id: generateId(), label: "Лезвия Gillette", amount: 12, date: today(), type: "expense" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [clients, setClients] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [filterDate, setFilterDate] = useState(today());
  const [toast, setToast] = useState(null);

  // derive clients from bookings
  useEffect(() => {
    const map = {};
    bookings.forEach(b => {
      if (!map[b.phone]) map[b.phone] = { name: b.client, phone: b.phone, visits: 0, spent: 0, last: b.date };
      map[b.phone].visits++;
      map[b.phone].spent += b.price;
      if (b.date > map[b.phone].last) map[b.phone].last = b.date;
    });
    setClients(Object.values(map));
  }, [bookings]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const todayBookings = bookings.filter(b => b.date === today());
  const totalRevenue = bookings.filter(b => b.date === today()).reduce((s, b) => s + b.price, 0);
  const totalExpenses = expenses.filter(e => e.date === today()).reduce((s, e) => s + e.amount, 0);
  const upcoming = bookings.filter(b => b.date >= today()).sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time));

  const tabs = [
    { id: "dashboard", label: "Главная", icon: "⚡" },
    { id: "bookings", label: "Запись", icon: "📅" },
    { id: "finance", label: "Касса", icon: "💰" },
    { id: "clients", label: "Клиенты", icon: "👤" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0ece4", fontFamily: "'Inter', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative" }}>

      {/* HEADER */}
      <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, letterSpacing: 2, color: "#f0ece4" }}>ЯВАН</div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: "#666", textTransform: "uppercase" }}>Barber CRM</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#888" }}>
            {new Date().toLocaleDateString("ru-RU", { weekday:"short", day:"numeric", month:"short" })}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: toast.type === "success" ? "#1a3a1a" : "#3a1a1a", border: `1px solid ${toast.type === "success" ? "#2d6a2d" : "#6a2d2d"}`, color: toast.type === "success" ? "#7dff7d" : "#ff7d7d", padding: "10px 20px", borderRadius: 10, fontSize: 13, zIndex: 999, whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* CONTENT */}
      <div style={{ padding: "0 0 80px" }}>
        {tab === "dashboard" && <Dashboard bookings={todayBookings} upcoming={upcoming} totalRevenue={totalRevenue} totalExpenses={totalExpenses} onBook={() => { setTab("bookings"); setShowBookingForm(true); }} setBookings={setBookings} showToast={showToast} />}
        {tab === "bookings" && <Bookings bookings={bookings} setBookings={setBookings} showForm={showBookingForm} setShowForm={setShowBookingForm} filterDate={filterDate} setFilterDate={setFilterDate} showToast={showToast} />}
        {tab === "finance" && <Finance bookings={bookings} expenses={expenses} setExpenses={setExpenses} showExpenseForm={showExpenseForm} setShowExpenseForm={setShowExpenseForm} showToast={showToast} />}
        {tab === "clients" && <Clients clients={clients} bookings={bookings} />}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#111", borderTop: "1px solid #222", display: "flex" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "12px 4px 10px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? "#c9a96e" : "#555", fontWeight: tab === t.id ? 600 : 400, letterSpacing: 0.5 }}>{t.label}</span>
            {tab === t.id && <div style={{ width: 20, height: 2, background: "#c9a96e", borderRadius: 1 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── DASHBOARD ──
function Dashboard({ bookings, upcoming, totalRevenue, totalExpenses, onBook, setBookings, showToast }) {
  const profit = totalRevenue - totalExpenses;
  return (
    <div style={{ padding: 20 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        <StatCard label="Выручка" value={`$${totalRevenue}`} color="#c9a96e" />
        <StatCard label="Расходы" value={`$${totalExpenses}`} color="#e07070" />
        <StatCard label="Прибыль" value={`$${profit}`} color={profit >= 0 ? "#7dff7d" : "#ff7d7d"} />
      </div>

      {/* Today */}
      <SectionTitle>Сегодня · {bookings.length} записей</SectionTitle>
      {bookings.length === 0 ? (
        <EmptyState icon="📭" text="Записей нет" sub="Добавьте первую запись" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {bookings.map(b => <BookingCard key={b.id} booking={b} setBookings={setBookings} showToast={showToast} />)}
        </div>
      )}

      {/* Quick book */}
      <button onClick={onBook} style={{ width: "100%", background: "#c9a96e", color: "#0a0a0a", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 1, marginBottom: 24 }}>
        + НОВАЯ ЗАПИСЬ
      </button>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <>
          <SectionTitle>Предстоящие</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcoming.slice(0, 5).map(b => (
              <div key={b.id} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{b.client}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{b.master} · {b.service}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#c9a96e", fontWeight: 600 }}>{fmtDate(b.date)}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{b.time}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 10, color: "#555", marginTop: 2, letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

// ── BOOKINGS ──
function Bookings({ bookings, setBookings, showForm, setShowForm, filterDate, setFilterDate, showToast }) {
  const filtered = bookings.filter(b => b.date === filterDate).sort((a,b) => a.time.localeCompare(b.time));

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <SectionTitle style={{ margin: 0 }}>Записи</SectionTitle>
        <button onClick={() => setShowForm(true)} style={{ background: "#c9a96e", color: "#0a0a0a", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ Добавить</button>
      </div>

      <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
        style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0ece4", borderRadius: 10, padding: "10px 14px", fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />

      {filtered.length === 0 ? (
        <EmptyState icon="📅" text="Нет записей" sub="На этот день записей нет" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(b => <BookingCard key={b.id} booking={b} setBookings={setBookings} showToast={showToast} full />)}
        </div>
      )}

      {showForm && <BookingForm onClose={() => setShowForm(false)} setBookings={setBookings} showToast={showToast} />}
    </div>
  );
}

function BookingCard({ booking: b, setBookings, showToast, full }) {
  const statusColor = b.status === "confirmed" ? "#7dff7d" : b.status === "done" ? "#c9a96e" : "#ffcc44";
  const statusLabel = b.status === "confirmed" ? "Подтверждено" : b.status === "done" ? "Выполнено" : "Ожидает";

  const markDone = () => {
    setBookings(prev => prev.map(x => x.id === b.id ? { ...x, status: "done" } : x));
    showToast(`✅ ${b.client} — выполнено`);
  };
  const remove = () => {
    setBookings(prev => prev.filter(x => x.id !== b.id));
    showToast(`🗑 Запись удалена`, "error");
  };

  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{b.client}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{b.phone}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#c9a96e" }}>${b.price}</div>
          <div style={{ fontSize: 11, color: "#555" }}>{b.time}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <Tag>{b.master}</Tag>
        <Tag>{b.service}</Tag>
        <Tag color={statusColor}>{statusLabel}</Tag>
      </div>
      {full && b.status !== "done" && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={markDone} style={{ flex: 1, background: "#1a3a1a", border: "1px solid #2d6a2d", color: "#7dff7d", borderRadius: 8, padding: "8px", fontSize: 12, cursor: "pointer" }}>✓ Выполнено</button>
          <button onClick={remove} style={{ background: "#2a1a1a", border: "1px solid #5a2a2a", color: "#e07070", borderRadius: 8, padding: "8px 14px", fontSize: 12, cursor: "pointer" }}>✕</button>
        </div>
      )}
    </div>
  );
}

function BookingForm({ onClose, setBookings, showToast }) {
  const [form, setForm] = useState({ client: "", phone: "", master: MASTERS[0], service: SERVICES[0].name, date: today(), time: "10:00" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const service = SERVICES.find(s => s.name === form.service);

  const submit = () => {
    if (!form.client || !form.phone) { showToast("Заполните имя и телефон", "error"); return; }
    setBookings(prev => [...prev, { ...form, id: generateId(), price: service.price, status: "confirmed" }]);
    showToast(`✅ ${form.client} записан на ${form.time}`);
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#111", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480, margin: "0 auto", border: "1px solid #222" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, letterSpacing: 1 }}>Новая запись</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>

        {[["client", "Имя клиента", "text"], ["phone", "Телефон", "tel"]].map(([k, ph, t]) => (
          <input key={k} type={t} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)}
            style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0ece4", borderRadius: 10, padding: "12px 14px", fontSize: 14, marginBottom: 10, boxSizing: "border-box" }} />
        ))}

        <select value={form.master} onChange={e => set("master", e.target.value)}
          style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0ece4", borderRadius: 10, padding: "12px 14px", fontSize: 14, marginBottom: 10 }}>
          {MASTERS.map(m => <option key={m}>{m}</option>)}
        </select>

        <select value={form.service} onChange={e => set("service", e.target.value)}
          style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0ece4", borderRadius: 10, padding: "12px 14px", fontSize: 14, marginBottom: 10 }}>
          {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name} — ${s.price}</option>)}
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0ece4", borderRadius: 10, padding: "12px 10px", fontSize: 13 }} />
          <select value={form.time} onChange={e => set("time", e.target.value)}
            style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0ece4", borderRadius: 10, padding: "12px 10px", fontSize: 13 }}>
            {TIMES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div style={{ background: "#1a1a0a", border: "1px solid #3a3a1a", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#888", fontSize: 13 }}>Стоимость</span>
          <span style={{ color: "#c9a96e", fontWeight: 700 }}>${service?.price}</span>
        </div>

        <button onClick={submit} style={{ width: "100%", background: "#c9a96e", color: "#0a0a0a", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Записать клиента
        </button>
      </div>
    </div>
  );
}

// ── FINANCE ──
function Finance({ bookings, expenses, setExpenses, showExpenseForm, setShowExpenseForm, showToast }) {
  const [period, setPeriod] = useState("today");
  const [expForm, setExpForm] = useState({ label: "", amount: "" });

  const filterFn = (item) => {
    const d = new Date(item.date);
    const now = new Date();
    if (period === "today") return item.date === today();
    if (period === "week") { const w = new Date(now); w.setDate(now.getDate()-7); return d >= w; }
    if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    return true;
  };

  const revenue = bookings.filter(filterFn).reduce((s,b) => s+b.price, 0);
  const exp = expenses.filter(filterFn).reduce((s,e) => s+e.amount, 0);
  const profit = revenue - exp;

  const addExpense = () => {
    if (!expForm.label || !expForm.amount) { showToast("Заполните все поля", "error"); return; }
    setExpenses(prev => [...prev, { id: generateId(), label: expForm.label, amount: Number(expForm.amount), date: today(), type: "expense" }]);
    setExpForm({ label: "", amount: "" });
    setShowExpenseForm(false);
    showToast("✅ Расход добавлен");
  };

  const periodLabels = { today: "Сегодня", week: "Неделя", month: "Месяц" };

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle>Касса</SectionTitle>

      {/* Period tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {Object.entries(periodLabels).map(([k,v]) => (
          <button key={k} onClick={() => setPeriod(k)} style={{ flex: 1, background: period===k ? "#c9a96e" : "#1a1a1a", color: period===k ? "#0a0a0a" : "#666", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px", fontSize: 12, fontWeight: period===k?700:400, cursor: "pointer" }}>{v}</button>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        <StatCard label="Выручка" value={`$${revenue}`} color="#c9a96e" />
        <StatCard label="Расходы" value={`$${exp}`} color="#e07070" />
        <StatCard label="Прибыль" value={`$${profit}`} color={profit>=0?"#7dff7d":"#ff7d7d"} />
      </div>

      {/* Transactions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <SectionTitle style={{ margin: 0 }}>Операции</SectionTitle>
        <button onClick={() => setShowExpenseForm(true)} style={{ background: "#2a1a1a", border: "1px solid #5a2a2a", color: "#e07070", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}>− Расход</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bookings.filter(filterFn).map(b => (
          <TxRow key={b.id} label={`${b.client} · ${b.service}`} sub={`${b.master} · ${b.time}`} amount={b.price} type="income" date={b.date} />
        ))}
        {expenses.filter(filterFn).map(e => (
          <TxRow key={e.id} label={e.label} amount={e.amount} type="expense" date={e.date} />
        ))}
        {bookings.filter(filterFn).length + expenses.filter(filterFn).length === 0 && (
          <EmptyState icon="💰" text="Нет операций" sub="За выбранный период данных нет" />
        )}
      </div>

      {showExpenseForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
          <div style={{ background: "#111", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480, margin: "0 auto", border: "1px solid #222" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18 }}>Добавить расход</div>
              <button onClick={() => setShowExpenseForm(false)} style={{ background: "none", border: "none", color: "#666", fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <input placeholder="Название (напр. Шампунь)" value={expForm.label} onChange={e => setExpForm(p=>({...p,label:e.target.value}))}
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0ece4", borderRadius: 10, padding: "12px 14px", fontSize: 14, marginBottom: 10, boxSizing: "border-box" }} />
            <input type="number" placeholder="Сумма ($)" value={expForm.amount} onChange={e => setExpForm(p=>({...p,amount:e.target.value}))}
              style={{ width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0ece4", borderRadius: 10, padding: "12px 14px", fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />
            <button onClick={addExpense} style={{ width: "100%", background: "#e07070", color: "#0a0a0a", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Добавить расход</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TxRow({ label, sub, amount, type, date }) {
  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{sub}</div>}
        <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{fmtDate(date)}</div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: type === "income" ? "#7dff7d" : "#e07070" }}>
        {type === "income" ? "+" : "−"}${amount}
      </div>
    </div>
  );
}

// ── CLIENTS ──
function Clients({ clients, bookings }) {
  const [search, setSearch] = useState("");
  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  return (
    <div style={{ padding: 20 }}>
      <SectionTitle>Клиенты · {clients.length}</SectionTitle>
      <input placeholder="Поиск по имени или телефону..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", background: "#111", border: "1px solid #222", color: "#f0ece4", borderRadius: 10, padding: "12px 14px", fontSize: 14, marginBottom: 16, boxSizing: "border-box" }} />

      {filtered.length === 0 ? (
        <EmptyState icon="👤" text="Клиентов нет" sub="Записи появятся здесь автоматически" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.sort((a,b) => b.visits - a.visits).map(c => (
            <div key={c.phone} style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 12, padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{c.phone}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#c9a96e" }}>${c.spent}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>потрачено</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Tag>{c.visits} визит{c.visits===1?"":"а"}</Tag>
                <Tag>последний {fmtDate(c.last)}</Tag>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SHARED ──
function SectionTitle({ children, style }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginBottom: 12, ...style }}>{children}</div>;
}

function Tag({ children, color }) {
  return (
    <span style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: color || "#666" }}>{children}</span>
  );
}

function EmptyState({ icon, text, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: "#444" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>{text}</div>
      <div style={{ fontSize: 12, color: "#333" }}>{sub}</div>
    </div>
  );
}
