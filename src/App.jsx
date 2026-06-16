import React, { useState, useEffect } from "react";

const defaultSettings = {
openTime: "09:00",
closeTime: "20:00",
masters: ["ХУДОЁР"],
services: [
{ name: "Стрижка", price: 20 },
{ name: "Стрижка + борода", price: 35 },
{ name: "Борода", price: 15 }
]
};

export default function App() {
const [tab, setTab] = useState("bookings");

const [settings, setSettings] = useState(() => {
return JSON.parse(localStorage.getItem("settings")) || defaultSettings;
});

const [bookings, setBookings] = useState(() => {
return JSON.parse(localStorage.getItem("bookings")) || [];
});

const [client, setClient] = useState("");
const [phone, setPhone] = useState("");
const [master, setMaster] = useState(settings.masters[0] || "");
const [service, setService] = useState(
settings.services[0]?.name || ""
);
const [date, setDate] = useState(
new Date().toISOString().split("T")[0]
);
const [time, setTime] = useState("10:00");

const [newMaster, setNewMaster] = useState("");
const [newService, setNewService] = useState("");
const [newPrice, setNewPrice] = useState("");

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

const selectedService = settings.services.find(
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
setBookings(bookings.filter(b => b.id !== id));
};

const addMaster = () => {
if (!newMaster) return;

setSettings({
  ...settings,
  masters: [...settings.masters, newMaster]
});

setNewMaster("");

};

const removeMaster = name => {
setSettings({
...settings,
masters: settings.masters.filter(
m => m !== name
)
});
};

const addService = () => {
if (!newService || !newPrice) return;

setSettings({
  ...settings,
  services: [
    ...settings.services,
    {
      name: newService,
      price: Number(newPrice)
    }
  ]
});

setNewService("");
setNewPrice("");

};

const removeService = name => {
setSettings({
...settings,
services: settings.services.filter(
s => s.name !== name
)
});
};

const today = new Date()
.toISOString()
.split("T")[0];

const todayRevenue = bookings
.filter(b => b.date === today)
.reduce((sum, b) => sum + b.price, 0);

return (
<div
style={{
background: "#111",
color: "white",
minHeight: "100vh",
padding: 20,
fontFamily: "sans-serif"
}}
>
<h1>ЯВАН БАРБЕР CRM</h1>

  <div style={{ marginTop: 20 }}>
    <button onClick={() => setTab("bookings")}>
      Записи
    </button>

    <button
      onClick={() => setTab("clients")}
      style={{ marginLeft: 10 }}
    >
      Клиенты
    </button>

    <button
      onClick={() => setTab("settings")}
      style={{ marginLeft: 10 }}
    >
      Настройки
    </button>
  </div>

  <hr style={{ margin: "20px 0" }} />

  {tab === "bookings" && (
    <>
      <h2>
        Доход сегодня: ${todayRevenue}
      </h2>

      <div
        style={{
          display: "grid",
          gap: 10,
          marginTop: 20
        }}
      >
        <input
          placeholder="Клиент"
          value={client}
          onChange={e =>
            setClient(e.target.value)
          }
        />

        <input
          placeholder="Телефон"
          value={phone}
          onChange={e =>
            setPhone(e.target.value)
          }
        />

        <select
          value={master}
          onChange={e =>
            setMaster(e.target.value)
          }
        >
          {settings.masters.map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <select
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
          type="date"
          value={date}
          onChange={e =>
            setDate(e.target.value)
          }
        />

        <input
          type="time"
          value={time}
          onChange={e =>
            setTime(e.target.value)
          }
        />

        <button onClick={addBooking}>
          Добавить запись
        </button>
      </div>

      <h2 style={{ marginTop: 30 }}>
        Все записи
      </h2>

      {bookings.map(b => (
        <div
          key={b.id}
          style={{
            border: "1px solid #444",
            padding: 10,
            marginTop: 10
          }}
        >
          <b>{b.client}</b>

          <p>{b.phone}</p>

          <p>{b.master}</p>

          <p>{b.service}</p>

          <p>${b.price}</p>

          <p>
            {b.date} {b.time}
          </p>

          <a
            href={`https://wa.me/${b.phone.replace(/\D/g,"")}`}
            target="_blank"
          >
            WhatsApp
          </a>

          <button
            onClick={() =>
              deleteBooking(b.id)
            }
            style={{
              marginLeft: 10
            }}
          >
            Удалить
          </button>
        </div>
      ))}
    </>
  )}

  {tab === "clients" && (
    <>
      <h2>Клиенты</h2>

      {[
        ...new Map(
          bookings.map(b => [
            b.phone,
            b
          ])
        ).values()
      ].map(c => (
        <div
          key={c.phone}
          style={{
            border: "1px solid #444",
            padding: 10,
            marginTop: 10
          }}
        >
          <b>{c.client}</b>

          <p>{c.phone}</p>
        </div>
      ))}
    </>
  )}

  {tab === "settings" && (
    <>
      <h2>Мастера</h2>

      <input
        value={newMaster}
        onChange={e =>
          setNewMaster(e.target.value)
        }
        placeholder="Имя мастера"
      />

      <button onClick={addMaster}>
        Добавить
      </button>

      {settings.masters.map(m => (
        <div key={m}>
          {m}
          <button
            onClick={() =>
              removeMaster(m)
            }
          >
            Удалить
          </button>
        </div>
      ))}

      <h2
        style={{
          marginTop: 30
        }}
      >
        Услуги
      </h2>

      <input
        placeholder="Услуга"
        value={newService}
        onChange={e =>
          setNewService(e.target.value)
        }
      />

      <input
        placeholder="Цена"
        value={newPrice}
        onChange={e =>
          setNewPrice(e.target.value)
        }
      />

      <button onClick={addService}>
        Добавить
      </button>

      {settings.services.map(s => (
        <div key={s.name}>
          {s.name} - ${s.price}
          <button
            onClick={() =>
              removeService(s.name)
            }
          >
            Удалить
          </button>
        </div>
      ))}
    </>
  )}
</div>

);
        }
