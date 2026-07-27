import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import CategoryPage from './CategoryPage'; // Yeni yaradacağımız kateqoriya səhifəsi
import AdminPanel from "./AdminPanel";    // Admin paneli

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      {/* Səhifənin ən altında gözə çarpmayan gizli Admin düyməsi */}
      <footer style={{ textAlign: 'center', padding: '20px 0', opacity: 0.4 }}>
        <Link to="/admin" style={{ textDecoration: 'none', color: 'inherit', fontSize: '12px' }}>
          🔒 Admin Panel
        </Link>
      </footer>
    </Router>
  );
}

export default App;