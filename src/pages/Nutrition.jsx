import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../App.css'

function Nutrition() {
  // Состояние для переключения вкладок: 'list' | 'product' | 'meal'
  const [activeTab, setActiveTab] = useState('list');

  // Стейты для формы нового продукта
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Моковые данные базы продуктов (потом будем тянуть из БД)
  const mockDatabase = [
    { name: 'Скир (Skyr)', cal: 65, p: 11, c: 4, f: 0.2 },
    { name: 'Овсянка', cal: 389, p: 16.9, c: 66.3, f: 6.9 },
  ];

  return (
    <div className="page-layout">
      <Navbar />
      
      <div className="main-container">
        <header className="page-header">
          <h1>Nutrition 🥗</h1>
          <p className="page-subtitle">Here are all your foods and recepies.</p>
        </header>

        <main className="content">
          {/* Навигация по вкладкам */}
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              Stack of products
            </button>
            <button 
              className={`tab-button ${activeTab === 'product' ? 'active' : ''}`}
              onClick={() => setActiveTab('product')}
            >
              Create product
            </button>
            <button 
              className={`tab-button ${activeTab === 'meal' ? 'active' : ''}`}
              onClick={() => setActiveTab('meal')}
            >
              Create recipe
            </button>
          </div>

          {/* КОНТЕНТ ВКЛАДОК */}
          <div className="card">
            
            {/* Вкладка 1: Список продуктов */}
            {activeTab === 'list' && (
              <div>
                <h3>My products</h3>
                <div className="search-bar-container" style={{ margin: '15px 0' }}>
                  <input type="text" placeholder="Search for product..." className="search-input" />
                </div>
                <ul className="food-list">
                  {mockDatabase.map((item, idx) => (
                    <li key={idx} className="food-item">
                      <span className="food-name">{item.name}</span>
                      <span className="food-details">
                        {item.cal} ккал | Б: {item.p} У: {item.c} Ж: {item.f} (на 100г)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Вкладка 2: Создание базового продукта */}
            {activeTab === 'product' && (
              <div>
                <h3>New product (per 100 g)</h3>
                <form className="auth-form" style={{ marginTop: '20px' }}>
                  <div className="input-group">
                    <label>Name</label>
                    <input type="text" placeholder="Avocado..." required />
                  </div>
                  <div className="input-group">
                    <label>Calories (kcal)</label>
                    <input type="number" step="0.1" required />
                  </div>
                  <div style={{ display: 'flex', gap: '1px' }}>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Protein (g)</label>
                      <input type="number" step="0.1" required />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Carbs (g)</label>
                      <input type="number" step="0.1" required />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Fats (g)</label>
                      <input type="number" step="0.1" required />
                    </div>
                  </div>
                  <button type="submit" className="log-food-button" style={{ marginTop: '20px', width: '100%' }}>
                    Save product
                  </button>
                </form>
              </div>
            )}

            {/* Вкладка 3: Создание составного блюда */}
            {activeTab === 'meal' && (
              <div>
                <h3>Adding your recipe</h3>
                <p className="auth-subtitle">Multiple ingridients (For example: Borscht)</p>
                
                <form className="auth-form" style={{ marginTop: '20px' }}>
                  <div className="input-group">
                    <label>Recipe name</label>
                    <input type="text" placeholder="My borscht..." required />
                  </div>
                  
                  <div className="ingredients-section" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <p style={{ fontWeight: '600', marginBottom: '10px' }}>Ingredients:</p>
                    <ul className="food-list" style={{ marginBottom: '15px' }}>
                      <li className="food-item empty-state">No products yet. Press "Add" below.</li>
                    </ul>
                    <button type="button" className="login-button" style={{ width: '100%' }}>
                      + Add ingredient
                    </button>
                  </div>

                  <button type="submit" className="log-food-button" style={{ marginTop: '20px', width: '100%' }}>
                    Save recipe
                  </button>
                </form>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}

export default Nutrition;