import { useState } from 'react';
import { data, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (response.ok) {
      const userData = await response.json();
      // Самое главное: сохраняем ID пользователя в память браузера
      localStorage.setItem('userId', userData.user_id);
      
      navigate('/dashboard'); 
    } else {
      const errorData = await response.json();
      alert(errorData); 
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};

const handleRegister = async (e) => { 
  e.preventDefault();
  
  try {
    const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: "NewUser",
        email: email,
        password: password
      })
    });

    if (response.ok) {
      localStorage.setItem('userId', data.user_id)
      navigate('/dashboard'); 
    } else {
      const errorData = await response.json();
      alert(errorData); 
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Fitness tracker </h2>
        <p className="auth-subtitle">Log in in to continue your trainings</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-button" onClick={handleLogin}>Log in</button>

          <p className="signin-subtitle" >Still not registered? Start now</p>
          <button type="submit" className="signin-button" onClick={handleRegister}>Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default Login;