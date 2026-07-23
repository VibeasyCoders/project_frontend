import { Link, useLocation, useNavigate } from 'react-router-dom';
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

export default Navbar;