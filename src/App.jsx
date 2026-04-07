import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'experiments';

function App() {
  // Загрузка из localStorage
  const [experiments, setExperiments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState('all');

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  }, [experiments]);

  // Добавление эксперимента
  const addExperiment = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const status = form.status.value;
    
    if (name) {
      const newExp = {
        id: Date.now(),
        name: name,
        status: status,
        date: new Date().toLocaleDateString()
      };
      setExperiments([newExp, ...experiments]);
      form.reset();
      form.name.focus();
    }
  };

  // Удаление эксперимента
  const deleteExperiment = (id) => {
    setExperiments(experiments.filter(exp => exp.id !== id));
  };

  // Изменение статуса
  const updateStatus = (id, newStatus) => {
    setExperiments(experiments.map(exp => 
      exp.id === id ? { ...exp, status: newStatus } : exp
    ));
  };

  // Подсчёт завершённых
  const completedCount = experiments.filter(exp => exp.status === 'completed').length;

  // Фильтрация
  const filteredExperiments = filter === 'all' 
    ? experiments 
    : experiments.filter(exp => exp.status === filter);

  return (
    <div className="app">
      <h1>🔬 Учёт экспериментов</h1>
      
      <div className="stats">
        ✅ Завершено: {completedCount}
      </div>

      {/* Форма добавления */}
      <form onSubmit={addExperiment} className="form">
        <input 
          type="text" 
          name="name" 
          placeholder="Название эксперимента" 
          required
        />
        <select name="status">
          <option value="plan">📋 План</option>
          <option value="in-progress">⚙️ В процессе</option>
          <option value="completed">✅ Завершён</option>
        </select>
        <button type="submit">➕ Добавить</button>
      </form>

      {/* Фильтр */}
      <div className="filter">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>
          Все
        </button>
        <button onClick={() => setFilter('plan')} className={filter === 'plan' ? 'active' : ''}>
          📋 План
        </button>
        <button onClick={() => setFilter('in-progress')} className={filter === 'in-progress' ? 'active' : ''}>
          ⚙️ В процессе
        </button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>
          ✅ Завершён
        </button>
      </div>

      {/* Список экспериментов */}
      <div className="list">
        {filteredExperiments.length === 0 ? (
          <p className="empty">Нет экспериментов</p>
        ) : (
          filteredExperiments.map(exp => (
            <div key={exp.id} className="card">
              <div className="card-header">
                <h3>{exp.name}</h3>
                <button onClick={() => deleteExperiment(exp.id)} className="delete">
                  ✖
                </button>
              </div>
              <select 
                value={exp.status}
                onChange={(e) => updateStatus(exp.id, e.target.value)}
              >
                <option value="plan">📋 План</option>
                <option value="in-progress">⚙️ В процессе</option>
                <option value="completed">✅ Завершён</option>
              </select>
              <small>{exp.date}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;