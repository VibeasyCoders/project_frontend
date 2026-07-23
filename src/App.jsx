import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import Auth from './pages/Auth';
import './App.css';
import Pisun from './pages/Test';
import Nutrition from './pages/Nutrition';
import Navbar from './components/Navbar';
import Training from './pages/Training/Training';

// --- КОМПОНЕНТ МОДАЛКИ (Вставляем над Dashboard) ---
function LogFoodModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Log food</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <input 
            type="text" 
            placeholder="Search  product..." 
            className="search-input"
          />
          
          <div className="recent-foods">
            <p className="section-title">Recently used:</p>
            {/* Пока это заглушки, позже будем тянуть их из базы */}
            <ul className="food-list">
              <li className="food-item">
                <span className="food-name">Скир (Skyr)</span>
                <button className="add-btn">+</button>
              </li>
              <li className="food-item">
                <span className="food-name">Овсянка</span>
                <button className="add-btn">+</button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="log-food-button" style={{width: '100%'}} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ОБНОВЛЕННЫЙ DASHBOARD ---
function Dashboard() {
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState(false);
  // Добавляем состояние для управления модалкой
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/nutrition/today/1')
      .then(response => response.json())
      .then(data => setNutritionData(data))
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, []);

  // Эта функция теперь просто открывает модалку, а не перекидывает на другую страницу
  const handleLogFood = (e) => {
    e.preventDefault();
    setIsModalOpen(true); 
  };

  return (
    <div className="page-layout">
      <Navbar />
      
      <div className="main-container">
        <header className="page-header">
          <h1>My diary</h1>
          <p className="page-subtitle">Welcome back! Here's your summary</p>
        </header>

        <main className="content">
          <h2>Today's report</h2>
          {error ? (
            <p className="error-text">Loading not successful. Backend error.</p>
          ) : !nutritionData ? (
            <p>Loading...</p>
          ) : (
            <div className="card">
              <div className="card-header">
                <h3>Ate today</h3>
                <div className="macros">
                  <span className="macro-badge">Calories: {nutritionData.summary.total_calories} kcal</span>
                  <span className="macro-badge protein">Protein: {nutritionData.summary.total_protein} g</span>
                  <span className="macro-badge carbs">Carbs: {nutritionData.summary.total_carbs} g</span>
                  <span className="macro-badge fats">Fats: {nutritionData.summary.total_fats} g</span>
                </div>
              </div>
              <ul className="food-list">
                {nutritionData.items_eaten.map((item, index) => (
                  <li key={index} className="food-item">
                    <span className="food-name">{item.food_name} ({item.meal_type})</span>
                    <span className="food-details">{item.weight_grams} g — {item.calories} kcal</span>
                  </li>
                ))}
                {nutritionData.items_eaten.length === 0 && (
                  <li className="food-item empty-state">No food logged today yet.</li>
                )}
              </ul>
              
              {/* При клике меняем стейт, чтобы открыть модалку */}
              <button className='log-food-button' onClick={handleLogFood}>Log</button>
            </div>
          )}
        </main>
      </div>

      {/* Если стейт true, рисуем модалку поверх всего */}
      {isModalOpen && (
        <LogFoodModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

// Временные заглушки для новых страниц
function PlaceholderPage({ title, emoji }) {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="main-container">
        <header className="page-header">
          <h1>{title}</h1>
        </header>
        <main className="content">
          <div className="card empty-card">
            <span className="empty-icon">{emoji}</span>
            <h3>Work in progress</h3>
            <p>This page is currently under construction.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

// Главный компонент, который управляет маршрутами
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/training" element={<Training />} />
        
      
        <Route path="/body-metrics" element={<PlaceholderPage title="Body Statistics" emoji="📈" />} />
        
        {/* Если кто-то заходит в корень сайта, сразу кидаем на логин */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;