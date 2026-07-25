import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../App.css'

function Nutrition() {
  const [activeTab, setActiveTab] = useState('list');
  const [products, setProducts] = useState([]); // Тут будут храниться продукты из базы
  const [recipes, setRecipes] = useState([]); // Тут будут храниться рецепты из базы

  // Стейты для формы нового продукта
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Стейты для создания рецепта
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState([]); // [{ food_id, food_name, weight_grams }]
  const [ingredientToAdd, setIngredientToAdd] = useState('');
  const [ingredientWeight, setIngredientWeight] = useState('');

  // Получаем ID пользователя из памяти браузера
  const userId = localStorage.getItem('userId');

  // Функция загрузки продуктов — вынесена отдельно, чтобы обновлять список после создания рецепта не нужно,
  // а вот список рецептов обновлять после сохранения нужно
  const fetchProducts = () => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/nutrition/products/${userId}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Ошибка загрузки продуктов:", err));
  };

  const fetchRecipes = () => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/nutrition/recipes/${userId}`)
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error("Ошибка загрузки рецептов:", err));
  };

  // Загружаем продукты и рецепты пользователя при открытии страницы
  useEffect(() => {
    fetchProducts();
    fetchRecipes();
  }, [userId]);

  // Функция для сохранения нового продукта
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    const newProduct = {
      user_id: userId,
      food_name: foodName,
      calories_100g: calories,
      protein_100g: protein,
      carbs_100g: carbs,
      fats_100g: fats
    };

    try {
      const response = await fetch('http://localhost:5000/api/nutrition/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        // Очищаем форму
        setFoodName(''); setCalories(''); setProtein(''); setCarbs(''); setFats('');
        // Обновляем список продуктов
        const savedProduct = await response.json();
        setProducts([...products, savedProduct]);
        // Переключаемся на вкладку со списком
        setActiveTab('list');
      }
    } catch (err) {
      console.error("Saving error:", err);
    }
  };

  // Добавить ингредиент в список текущего рецепта
  const handleAddIngredient = () => {
    if (!ingredientToAdd || !ingredientWeight) return;

    const product = products.find(p => p.food_id === Number(ingredientToAdd));
    if (!product) return;

    setRecipeIngredients([
      ...recipeIngredients,
      {
        food_id: product.food_id,
        food_name: product.food_name,
        weight_grams: ingredientWeight
      }
    ]);

    // Сбрасываем поля выбора
    setIngredientToAdd('');
    setIngredientWeight('');
  };

  // Удалить ингредиент из списка
  const handleRemoveIngredient = (indexToRemove) => {
    setRecipeIngredients(recipeIngredients.filter((_, idx) => idx !== indexToRemove));
  };

  // Сохранить рецепт целиком
  const handleCreateRecipe = async (e) => {
    e.preventDefault();

    if (recipeIngredients.length === 0) {
      alert("Добавь хотя бы один ингредиент");
      return;
    }

    const newRecipe = {
      user_id: userId,
      recipe_name: recipeName,
      ingredients: recipeIngredients.map(ing => ({
        food_id: ing.food_id,
        weight_grams: ing.weight_grams
      }))
    };

    try {
      const response = await fetch('http://localhost:5000/api/nutrition/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe)
      });

      if (response.ok) {
        setRecipeName('');
        setRecipeIngredients([]);
        fetchRecipes(); // Обновляем список рецептов, чтобы новый сразу появился в "Stack of products"
        setActiveTab('list');
      } else {
        alert("Ошибка при сохранении рецепта");
      }
    } catch (err) {
      console.error("Saving recipe error:", err);
    }
  };

  return (
    <div className="page-layout">
      <Navbar />
      
      <div className="main-container">
        <header className="page-header">
          <h1>Nutrition 🥗</h1>
          <p className="page-subtitle">Here are all your foods and recipes.</p>
        </header>

        <main className="content">
          <div className="tabs-container">
            <button className={`tab-button ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
              Stack of products
            </button>
            <button className={`tab-button ${activeTab === 'product' ? 'active' : ''}`} onClick={() => setActiveTab('product')}>
              Create product
            </button>
            <button className={`tab-button ${activeTab === 'meal' ? 'active' : ''}`} onClick={() => setActiveTab('meal')}>
              Create recipe
            </button>
          </div>

          <div className="card">
            
            {activeTab === 'list' && (
              <div>
                <h3>My products</h3>
                <div className="search-bar-container" style={{ margin: '15px 0' }}>
                  <input type="text" placeholder="Search for product..." className="search-input" />
                </div>
                <ul className="food-list">
                  {products.length === 0 ? (
                    <li className="food-item empty-state">You have no saved products yet.</li>
                  ) : (
                    products.map((item, idx) => (
                      <li key={`product-${idx}`} className="food-item">
                        <span className="food-name">{item.food_name}</span>
                        <span className="food-details">
                          {item.calories_100g} kcal | P: {item.protein_100g} C: {item.carbs_100g} F: {item.fats_100g} (на 100г)
                        </span>
                      </li>
                    ))
                  )}
                </ul>

                <h3 style={{ marginTop: '25px' }}>My recipes</h3>
                <ul className="food-list">
                  {recipes.length === 0 ? (
                    <li className="food-item empty-state">You have no saved recipes yet.</li>
                  ) : (
                    recipes.map((item, idx) => (
                      <li key={`recipe-${idx}`} className="food-item">
                        <span className="food-name">🍲 {item.recipe_name}</span>
                        <span className="food-details">
                          Total: {item.total_calories} kcal | P: {item.total_protein} C: {item.total_carbs} F: {item.total_fats}
                          {' '}(вес порции {item.total_weight_grams} г)
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'product' && (
              <div>
                <h3>New product (per 100 g)</h3>
                <form onSubmit={handleCreateProduct} className="auth-form" style={{ marginTop: '20px' }}>
                  <div className="input-group">
                    <label>Name</label>
                    <input type="text" value={foodName} onChange={e => setFoodName(e.target.value)} placeholder="Avocado..." required />
                  </div>
                  <div className="input-group">
                    <label>Calories (kcal)</label>
                    <input type="number" step="0.1" value={calories} onChange={e => setCalories(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Protein (g)</label>
                      <input type="number" step="0.1" value={protein} onChange={e => setProtein(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Carbs (g)</label>
                      <input type="number" step="0.1" value={carbs} onChange={e => setCarbs(e.target.value)} required />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Fats (g)</label>
                      <input type="number" step="0.1" value={fats} onChange={e => setFats(e.target.value)} required />
                    </div>
                  </div>
                  <button type="submit" className="log-food-button" style={{ marginTop: '20px', width: '100%' }}>
                    Save product
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'meal' && (
              <div>
                <h3>Adding your recipe</h3>
                <p className="auth-subtitle">Multiple ingredients (For example: Borscht)</p>
                <form onSubmit={handleCreateRecipe} className="auth-form" style={{ marginTop: '20px' }}>
                  <div className="input-group">
                    <label>Recipe name</label>
                    <input
                      type="text"
                      value={recipeName}
                      onChange={e => setRecipeName(e.target.value)}
                      placeholder="My borscht..."
                      required
                    />
                  </div>

                  <div className="ingredients-section" style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                    <p style={{ fontWeight: '600', marginBottom: '10px' }}>Ingredients:</p>

                    <ul className="food-list" style={{ marginBottom: '15px' }}>
                      {recipeIngredients.length === 0 ? (
                        <li className="food-item empty-state">No products yet. Press "Add" below.</li>
                      ) : (
                        recipeIngredients.map((ing, idx) => (
                          <li key={idx} className="food-item">
                            <span className="food-name">{ing.food_name}</span>
                            <span className="food-details">{ing.weight_grams} g</span>
                            <button
                              type="button"
                              className="close-btn"
                              onClick={() => handleRemoveIngredient(idx)}
                            >
                              ×
                            </button>
                          </li>
                        ))
                      )}
                    </ul>

                    <div className='input-group' style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <select
                        value={ingredientToAdd}
                        onChange={e => setIngredientToAdd(e.target.value)}
                        style={{ flex: 2 }}
                      >
                        <option value="" disabled hidden>Choose product...</option>
                        {products.map(p => (
                          <option key={p.food_id} value={p.food_id}>{p.food_name}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="grams"
                        value={ingredientWeight}
                        onChange={e => setIngredientWeight(e.target.value)}
                        style={{ flex: 1 }}
                      />
                    </div>

                    <button
                      type="button"
                      className="login-button"
                      style={{ width: '100%' }}
                      onClick={handleAddIngredient}
                    >
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