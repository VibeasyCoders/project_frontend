import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import Auth from './pages/Auth';
import './App.css';
import Pisun from './pages/Test';

// Компонент навигации (Navbar)
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = (e) => {
  e.preventDefault();
  console.log("Trying to log out:");
  // Future: Send registration request to backend, then maybe auto-login or show success message
  navigate('/auth'); // For now, just simulating success
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-text">Fitness tracker</span>
      </div>
      <div className="navbar-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span> Diary
        </Link>
        <Link 
          to="/training" 
          className={`nav-link ${location.pathname === '/training' ? 'active' : ''}`}
        >
          <span className="nav-icon">🏋️‍♂️</span> Training
        </Link>
        <Link 
          to="/nutrition" 
          className={`nav-link ${location.pathname === '/nutrition' ? 'active' : ''}`}
        >
          <span className="nav-icon">🥗</span> Nutrition
        </Link>
        <Link 
          to="/body-metrics" 
          className={`nav-link ${location.pathname === '/body-metrics' ? 'active' : ''}`}
        >
          <span className="nav-icon">📏</span> Body Stats
        </Link>
      </div>
      <div className="navbar-user">
        <div className="user-avatar">K</div>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}

// Выносим код дневника в отдельный компонент
function Dashboard() {
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/nutrition/today/1')
      .then(response => response.json())
      .then(data => setNutritionData(data))
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, []);

  const handleLogFood = (e) => {
    e.preventDefault();
    console.log("Navigating to nutrition logger...");
    navigate('/test'); // Меняем путь на страницу Nutrition
  };

  return (
    <div className="page-layout">
      <Navbar />
      
      <div className="main-container">
        <header className="page-header">
          <h1>My Diary</h1>
          <p className="page-subtitle">Welcome back! Here is your summary for today.</p>
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
              <button className='log-food-button' onClick={handleLogFood}>Log</button>
            </div>
          )}
        </main>
      </div>
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
        <Route path="/test" element={<Pisun />} />
        {/* Новые маршруты */}
        <Route path="/training" element={<PlaceholderPage title="Training Log" emoji="🏋️‍♂️" />} />
        
      
        <Route path="/body-metrics" element={<PlaceholderPage title="Body Statistics" emoji="📈" />} />
        
        {/* Если кто-то заходит в корень сайта, сразу кидаем на логин */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;