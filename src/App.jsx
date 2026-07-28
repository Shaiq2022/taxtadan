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
    </Router>
  );
}

export default App;