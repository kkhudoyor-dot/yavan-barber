import React, { useState, useEffect } from 'react';

export default function App() {
  const [view, setView] = useState('home');
  const [bookings, setBookings] = useState(JSON.parse(localStorage.getItem('bookings') || '[]'));
  const [clients, setClients] = useState(JSON.parse(localStorage.getItem('clients') || '[]'));
  const [masters, setMasters] = useState(JSON.parse(localStorage.getItem('masters') || '["Худоёр", "Ахмад"]'));
  const [services, setServices] = useState(JSON.parse(localStorage.getItem('services') || '[{"name":"Стрижка","price":20,"duration":30},{"name":"Стрижка + Борода","price":35,"duration":45},{"name":"Борода","price":15,"duration":20}]'));

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('clients', JSON.stringify(clients));
    localStorage.setItem('masters', JSON.stringify(masters));
    localStorage.setItem('services', JSON.stringify(services));
  }, [bookings, clients, masters, services]);

  const addBooking = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newBooking = Object.fromEntries(formData);
    
    // Простая проверка дублей
    setBookings([...bookings, { ...newBooking, id: Date.now() }]);
    alert('Запись добавлена!');
  };

  const getAvailableSlots = (master, date, selectedService) => {
    const slots = [];
    for (let h = 9; h < 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots; // В реальном проекте здесь фильтрация по занятости
  };

  return (
    <div className="app-container">
      {view === 'home' && (
        <div style={{padding: '20px'}}>
          <h2>Дашборд</h2>
          <div className="card">Доход за сегодня: {bookings.reduce((sum, b) => sum + 20, 0)} c.</div>
          <div className="card">Активных записей: {bookings.length}</div>
        </div>
      )}

      {view === 'bookings' && (
        <div style={{padding: '20px'}}>
          <h2>Создать запись</h2>
          <form onSubmit={addBooking}>
            <input name="client" placeholder="Имя клиента" required />
            <input name="phone" placeholder="Телефон" required />
            <select name="master">{masters.map(m => <option key={m}>{m}</option>)}</select>
            <select name="service">{services.map(s => <option key={s.name}>{s.name} ({s.price} c.)</option>)}</select>
            <input type="date" name="date" required />
            <input type="time" name="time" required />
            <button type="submit">Забронировать</button>
          </form>
          <div style={{marginTop: '20px'}}>
            {bookings.map(b => (
              <div key={b.id} className="card">
                <p>{b.client} - {b.service}</p>
                <p>{b.date} {b.time} | {b.master}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'clients' && (
        <div style={{padding: '20px'}}>
          <h2>Клиенты</h2>
          {clients.map((c, i) => (
            <div key={i} className="card">
              <p>{c.name}</p>
              <a href={`https://wa.me/${c.phone}`} className="btn-whatsapp">WhatsApp</a>
            </div>
          ))}
        </div>
      )}

      {view === 'settings' && (
        <div style={{padding: '20px'}}>
          <h2>Настройки</h2>
          <div className="card">
            <p>Мастера: {masters.join(', ')}</p>
          </div>
        </div>
      )}

      <div className="nav-bottom">
        <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Главная</div>
        <div className={`nav-item ${view === 'bookings' ? 'active' : ''}`} onClick={() => setView('bookings')}>Записи</div>
        <div className={`nav-item ${view === 'clients' ? 'active' : ''}`} onClick={() => setView('clients')}>Клиенты</div>
        <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>Настройки</div>
      </div>
    </div>
  );
}
