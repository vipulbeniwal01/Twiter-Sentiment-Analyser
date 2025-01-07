// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/home'
import About from './pages/about';
import './App.css'; // Import the CSS file

function App() {
  return (
    <Router>
      {/* Header Section */}
      <header className="header">
        <h1>Twitter Sentiment Analyzer</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;