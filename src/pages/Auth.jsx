import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); 
    console.log("Trying to log in with:", email, password);
    // Future: Send login request to backend
    navigate('/dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Trying to register with:", email, password);
    // Future: Send registration request to backend, then maybe auto-login or show success message
    navigate('/dashboard'); // For now, just simulating success
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