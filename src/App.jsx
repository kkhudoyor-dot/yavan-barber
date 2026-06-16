import React, { useEffect, useState } from "react";
import "./styles.css";

const defaultSettings = {
masters: ["ХУДОЁР"],
services: [
{ name: "Стрижка", price: 20 },
{ name: "Стрижка + Борода", price: 35 },
{ name: "Борода", price: 15 }
]
};

export default function App() {
const [tab, setTab] = useState("home");

const [settings, setSettings] = useState(() => {
return (
JSON.parse(localStorage.getItem("settings")) ||
defaultSettings
);
});

const [bookings, setBookings] = useState(() => {
return (
JSON.parse(localStorage.getItem("bookings")) ||
[]
);
});

const [client, setClient] = useState("");
const [phone, setPhone] = useState("");
const [master, setMaster] = useState(
settings.masters[0] || ""
);

const [service, setService] = useState(
settings.services[0]?.name || ""
);

const [date, setDate] = useState(
new Date().toISOString().split("T")[0]
);

const [time, setTime] = useState("10:00");

useEffect(() => {
localStorage.setItem(
"settings",
JSON.stringify(settings)
);
}, [settings]);

useEffect(() => {
localStorage.setItem(
"bookings",
JSON.stringify(bookings)
);
}, [bookings]);

const addBooking = () => {
if (!client || !phone) return;

const selectedService =
  settings.services.find(
    s => s.name === service
  );

const booking = {
  id: Date.now(),
  client,
  phone,
  master,
  service,
  price: selectedService?.price || 0,
  date,
  time
};

setBookings([booking, ...bookings]);

setClient("");
setPhone("");

};

const deleteBooking = id => {
setBookings(
bookings.filter(b => b.id !== id)
);
};

const today =
new Date().toISOString().split("T")[0];

const todayRevenue = bookings
.filter(b => b.date === today)
.reduce((sum, b) => sum + b.price, 0);

const clientsCount = new Set(
bookings.map(b => b.phone)
).size;

return (
<div className="app">

  <div className="header">
    <div className="logo">
      ЯВАН БАРБЕР CRM
    </div>

    <div className="subtitle">
      Управление барбершопом
    </div>
  </div>

  {tab === "home" && (
    <>
      <div className="stats">
        <div className="card">
          <div className="card-title">
            Доход сегодня
          </div>

          <div className="card-value">
            ${todayRevenue}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            Клиенты
          </div>

          <div className="card-value">
            {clientsCount}
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Последние записи</h2>

        {bookings.length === 0 && (
          <div className="card">
            Пока нет записей
          </div>
        )}

        {bookings.slice(0, 5).map(b => (
          <div
            key={b.id}
            className="booking-card"
          >
            <div className="client-name">
              {b.client}
            </div>

            <div className="service">
              {b.service}
            </div>

            <div className="service">
              {b.date} • {b.time}
            </div>

            <div className="price">
              ${b.price}
            </div>
          </div>
        ))}
      </div>
    </>
  )}

  {tab === "bookings" && (
    <div className="section">

      <div className="add-form">

        <input
          className="input"
          placeholder="Клиент"
          value={client}
          onChange={e =>
            setClient(e.target.value)
          }
        />

        <input
          className="input"
          placeholder="Телефон"
          value={phone}
          onChange={e =>
            setPhone(e.target.value)
          }
        />

        <select
          className="select"
          value={master}
          onChange={e =>
            setMaster(e.target.value)
          }
        >
          {settings.masters.map(m => (
            <option key={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={service}
          onChange={e =>
            setService(e.target.value)
          }
        >
          {settings.services.map(s => (
            <option key={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          className="input"
          type="date"
          value={date}
          onChange={e =>
            setDate(e.target.value)
          }
        />

        <input
          className="input"
          type="time"
          value={time}
          onChange={e =>
            setTime(e.target.value)
          }
        />

        <button
          className="btn btn-primary"
          onClick={addBooking}
        >
          Добавить запись
        </button>

      </div>
