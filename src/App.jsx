import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import Auth from './pages/Auth';
import './App.css';
import Pisun from './pages/Test';
import Nutrition from './pages/Nutrition';
import Navbar from './components/Navbar';
import Training from './pages/Training/Training';
import BodyStats from './pages/body-stats/BodyStats';



// --- КОМПОНЕНТ МОДАЛКИ (Вставляем над Dashboard) ---
function LogFoodModal({ userId, onClose, onSuccess }) {
  const [products, setProducts] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedValue, setSelectedValue] = useState(''); // формат: "product-<id>" или "recipe-<id>"
  const [consumedWeight, setConsumedWeight] = useState('');
  const [mealType, setMealType] = useState('Breakfast'); // По умолчанию Завтрак

  // При открытии модалки загружаем и продукты, и рецепты из БД
  useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:5000/api/nutrition/products/${userId}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error("Ошибка загрузки продуктов:", err));

      fetch(`http://127.0.0.1:5000/api/nutrition/recipes/${userId}`)
        .then(res => res.json())
        .then(data => setRecipes(data))
        .catch(err => console.error("Ошибка загрузки рецептов:", err));
    }
  }, [userId]);

  // Разбираем выбранное значение на тип и id
  const [itemType, itemId] = selectedValue ? selectedValue.split('-') : [null, null];
  const isRecipeSelected = itemType === 'recipe';

  const selectedRecipe = isRecipeSelected
    ? recipes.find(r => String(r.recipe_id) === itemId)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedValue) return;

    try {
      const response = await fetch('http://127.0.0.1:5000/api/nutrition/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          item_type: itemType,   // 'product' или 'recipe'
          item_id: itemId,
          // Граммы нужны только для продукта — для рецепта бэкенд сам берёт вес из recipe_items
          weight_grams: isRecipeSelected ? null : consumedWeight,
          meal_type: mealType
        })
      });

      if (response.ok) {
        onSuccess(); // Обновляем данные на главной странице
        onClose(); // Закрываем модалку
      } else {
        const err = await response.json().catch(() => null);
        alert(err || "Ошибка при сохранении");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Log food</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '10px' }}>
          
          <div className="input-group">
            <label>Meal Type</label>
            <select value={mealType} onChange={e => setMealType(e.target.value)} required>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div className="input-group">
            <label>Select Product or Recipe</label>
            <select
              value={selectedValue}
              onChange={e => {
                setSelectedValue(e.target.value);
                setConsumedWeight(''); // сбрасываем вес при смене выбора
              }}
              required
            >
              <option value="" disabled hidden>Choose product or recipe...</option>

              {products.length > 0 && (
                <optgroup label="Products">
                  {products.map(p => (
                    <option key={`product-${p.food_id}`} value={`product-${p.food_id}`}>
                      {p.food_name}
                    </option>
                  ))}
                </optgroup>
              )}

              {recipes.length > 0 && (
                <optgroup label="Recipes">
                  {recipes.map(r => (
                    <option key={`recipe-${r.recipe_id}`} value={`recipe-${r.recipe_id}`}>
                      {r.recipe_name}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          
          {isRecipeSelected ? (
            // Для рецепта граммы не спрашиваем — только показываем сводку по нему
            <div className="input-group">
              <label>Recipe portion</label>
              <p style={{ fontSize: '14px', color: '#555', marginTop: '5px' }}>
                Whole recipe will be logged: ~{selectedRecipe?.total_weight_grams} g,
                {' '}{selectedRecipe?.total_calories} kcal
              </p>
            </div>
          ) : (
            <div className="input-group">
              <label>Weight (grams)</label>
              <input 
                type="number" 
                placeholder="e.g. 150" 
                value={consumedWeight} 
                onChange={e => setConsumedWeight(e.target.value)} 
                required 
              />
            </div>
          )}
          
          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="submit" className="log-food-button" style={{width: '100%'}}>
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- ОБНОВЛЕННЫЙ DASHBOARD ---
function Dashboard() {
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Функция для загрузки дневника. Вынесена отдельно, чтобы модалка могла ее вызывать
const fetchDiaryData = async () => {
    if (!userId || userId === 'undefined' || userId === 'null') {
      console.log("Ошибка: нет валидного ID пользователя, уходим на логин.");
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/nutrition/today/${userId}`);
      // Сначала читаем ответ как простой текст, чтобы не сломаться, если сервер вернул ошибку
      const text = await response.text(); 
      let data;
      if (text) {
        data = JSON.parse(text); // Пробуем превратить текст в JSON
      }

      if (!response.ok) {
        throw new Error(data?.error || "Ошибка на стороне бэкенда");
      }


      // Защита от пустых данных для новых пользователей
      if (!data || !data.summary || !data.items_eaten) {
        setNutritionData({
          summary: { total_calories: "0.00", total_protein: "0.00", total_carbs: "0.00", total_fats: "0.00" },
          items_eaten: []
        });
      } else {
        setNutritionData(data);
      }

    } catch (err) {
      console.error("Error:", err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchDiaryData();
  }, [userId, navigate]);

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
              
              <button className='log-food-button' onClick={() => setIsModalOpen(true)}>Log</button>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <LogFoodModal 
          userId={userId} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchDiaryData} // Передаем функцию обновления
        />
      )}
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
        <Route path="/body-metrics" element={<BodyStats />} />

        
        {/* Если кто-то заходит в корень сайта, сразу кидаем на логин */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;